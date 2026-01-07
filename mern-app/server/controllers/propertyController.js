const Property = require('../models/Property');
const Availability = require('../models/Availability');

// @desc    Get all properties with filters
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    const {
      city,
      district,
      tourismCircuit,
      type,
      category,
      minPrice,
      maxPrice,
      checkIn,
      checkOut,
      guests,
      amenities,
      sortBy,
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = { 'approval.status': 'approved', 'availability.isActive': true };

    if (city) query['location.city'] = new RegExp(city, 'i');
    if (district) query['location.district'] = new RegExp(district, 'i');
    if (tourismCircuit) query['location.tourismCircuit'] = tourismCircuit;
    if (type) query.type = type;
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query['pricing.basePrice'] = {};
      if (minPrice) query['pricing.basePrice'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.basePrice'].$lte = Number(maxPrice);
    }
    if (amenities) {
      const amenitiesList = amenities.split(',');
      query['amenities.basic'] = { $all: amenitiesList };
    }

    // Sorting
    let sort = {};
    if (sortBy === 'price-low') sort['pricing.basePrice'] = 1;
    else if (sortBy === 'price-high') sort['pricing.basePrice'] = -1;
    else if (sortBy === 'rating') sort['ratings.average'] = -1;
    else if (sortBy === 'popular') sort['stats.totalBookings'] = -1;
    else sort = { featured: -1, 'ratings.average': -1 };

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const properties = await Property.find(query)
      .sort(sort)
      .limit(Number(limit))
      .skip(skip)
      .select('-__v');

    // If dates provided, filter by availability
    if (checkIn && checkOut) {
      const availableProperties = await filterByAvailability(
        properties,
        new Date(checkIn),
        new Date(checkOut),
        Number(guests) || 2
      );
      
      const total = availableProperties.length;
      return res.json({
        success: true,
        count: availableProperties.length,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        data: availableProperties
      });
    }

    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      count: properties.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: properties
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
};

// Helper function to filter properties by availability
async function filterByAvailability(properties, checkIn, checkOut, guests) {
  const availableProperties = [];
  
  for (const property of properties) {
    const isAvailable = await checkPropertyAvailability(
      property._id,
      checkIn,
      checkOut,
      guests
    );
    
    if (isAvailable) {
      availableProperties.push(property);
    }
  }
  
  return availableProperties;
}

// @desc    Get single property details
// @route   GET /api/properties/:id
// @access  Public
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner.ownerId', 'name email phone');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching property',
      error: error.message
    });
  }
};

// @desc    Check property availability
// @route   POST /api/properties/:id/check-availability
// @access  Public
exports.checkAvailability = async (req, res) => {
  try {
    const { checkIn, checkOut, guests, roomType } = req.body;
    const propertyId = req.params.id;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Check-in and check-out dates are required'
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validate dates
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    if (checkInDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past'
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check availability for date range
    const isAvailable = await checkPropertyAvailability(
      propertyId,
      checkInDate,
      checkOutDate,
      guests || 2,
      roomType
    );

    // Calculate pricing
    const pricing = await calculateBookingPrice(
      property,
      checkInDate,
      checkOutDate,
      roomType,
      guests
    );

    res.json({
      success: true,
      available: isAvailable,
      pricing: isAvailable ? pricing : null,
      message: isAvailable ? 'Property is available' : 'Property is not available for selected dates'
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking availability',
      error: error.message
    });
  }
};

// @desc    Create new property (Admin/Owner)
// @route   POST /api/properties
// @access  Private (Admin/Owner)
exports.createProperty = async (req, res) => {
  try {
    // Generate unique property ID
    const propertyId = await generatePropertyId();
    
    const propertyData = {
      ...req.body,
      propertyId,
      owner: {
        ownerId: req.user._id,
        name: req.user.name,
        email: req.user.email,
        contact: req.user.phone
      }
    };

    const property = await Property.create(propertyData);

    // Initialize availability calendar for next 365 days
    await initializePropertyAvailability(property._id, property.rooms, property.pricing.basePrice);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating property',
      error: error.message
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Admin/Owner)
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership
    if (req.user.role !== 'admin' && property.owner.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating property',
      error: error.message
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Admin)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    await property.remove();

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message
    });
  }
};

// Helper Functions

async function generatePropertyId() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PROP${year}${month}${random}`;
}

async function checkPropertyAvailability(propertyId, checkIn, checkOut, guests, roomType = null) {
  const dates = [];
  const currentDate = new Date(checkIn);
  
  while (currentDate < checkOut) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  for (const date of dates) {
    const availability = await Availability.findOne({
      propertyId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    });

    if (!availability || availability.isBlocked) {
      return false;
    }

    if (roomType) {
      if (!availability.isAvailable(roomType, 1)) {
        return false;
      }
    } else {
      if (availability.availableCapacity < 1) {
        return false;
      }
    }
  }

  return true;
}

async function calculateBookingPrice(property, checkIn, checkOut, roomType, guests) {
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  const room = property.rooms.find(r => r.roomType === roomType) || property.rooms[0];
  
  let baseAmount = room.basePrice * nights;
  let seasonalCharge = 0;
  let weekendCharge = 0;

  // Calculate seasonal and weekend charges
  const currentDate = new Date(checkIn);
  for (let i = 0; i < nights; i++) {
    const day = currentDate.getDay();
    const isWeekend = (day === 0 || day === 6);
    
    if (isWeekend) {
      weekendCharge += room.basePrice * (property.pricing.weekendMultiplier - 1);
    }
    
    // Check seasonal rates
    for (const seasonal of property.pricing.seasonalRates) {
      if (currentDate >= seasonal.startDate && currentDate <= seasonal.endDate) {
        seasonalCharge += room.basePrice * (seasonal.multiplier - 1);
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const subtotal = baseAmount + seasonalCharge + weekendCharge;
  const gst = subtotal * (property.pricing.taxes.gst / 100);
  const tourismFee = property.pricing.taxes.tourismFee || 0;
  const totalAmount = subtotal + gst + tourismFee;

  return {
    nights,
    baseAmount,
    seasonalCharge,
    weekendCharge,
    subtotal,
    gst,
    tourismFee,
    totalAmount,
    pricePerNight: room.basePrice
  };
}

async function initializePropertyAvailability(propertyId, rooms, basePrice) {
  const availabilityRecords = [];
  const startDate = new Date();
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const roomsAvailability = rooms.map(room => ({
      roomType: room.roomType,
      totalRooms: room.totalRooms,
      availableRooms: room.totalRooms,
      bookedRooms: 0,
      blockedRooms: 0
    }));
    
    const totalCapacity = rooms.reduce((sum, room) => sum + room.totalRooms, 0);
    
    availabilityRecords.push({
      propertyId,
      date,
      rooms: roomsAvailability,
      totalCapacity,
      availableCapacity: totalCapacity,
      pricing: {
        basePrice,
        seasonalMultiplier: 1,
        isWeekend: (date.getDay() === 0 || date.getDay() === 6),
        isFestival: false,
        finalPrice: basePrice
      }
    });
  }
  
  await Availability.insertMany(availabilityRecords);
}

module.exports = exports;
