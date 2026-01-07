import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/style.css';

const PropertyListing = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    tourismCircuit: '',
    sortBy: 'featured'
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const propertyTypes = ['homestay', 'hotel', 'resort', 'heritage', 'eco-lodge'];
  const categories = ['budget', 'standard', 'premium', 'luxury'];
  const tourismCircuits = ['Chambal', 'Bundelkhand', 'Mahakaushal', 'Malwa', 'Nimar', 'Vindhya'];

  useEffect(() => {
    fetchProperties();
  }, [filters, page]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        page,
        limit: 12
      });

      const response = await axios.get(`/api/properties?${queryParams}`);
      setProperties(response.data.data);
      setTotalPages(response.data.pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      type: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      checkIn: '',
      checkOut: '',
      guests: 2,
      tourismCircuit: '',
      sortBy: 'featured'
    });
    setPage(1);
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  return (
    <>
      <Navbar />
      <div className="property-listing-container">
        {/* Filters Section */}
        <div className="filters-section">
          <h2>Find Your Perfect Stay in Madhya Pradesh</h2>

          <div className="filters-grid">
            {/* Location Filters */}
            <div className="filter-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="Enter city name"
              />
            </div>

            <div className="filter-group">
              <label>Tourism Circuit</label>
              <select name="tourismCircuit" value={filters.tourismCircuit} onChange={handleFilterChange}>
                <option value="">All Circuits</option>
                {tourismCircuits.map(circuit => (
                  <option key={circuit} value={circuit}>{circuit}</option>
                ))}
              </select>
            </div>

            {/* Property Type & Category */}
            <div className="filter-group">
              <label>Property Type</label>
              <select name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div className="filter-group">
              <label>Check-in</label>
              <input
                type="date"
                name="checkIn"
                value={filters.checkIn}
                onChange={handleFilterChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="filter-group">
              <label>Check-out</label>
              <input
                type="date"
                name="checkOut"
                value={filters.checkOut}
                onChange={handleFilterChange}
                min={filters.checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label>Min Price (₹)</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min"
              />
            </div>

            <div className="filter-group">
              <label>Max Price (₹)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max"
              />
            </div>

            {/* Guests */}
            <div className="filter-group">
              <label>Guests</label>
              <input
                type="number"
                name="guests"
                value={filters.guests}
                onChange={handleFilterChange}
                min="1"
              />
            </div>

            {/* Sort By */}
            <div className="filter-group">
              <label>Sort By</label>
              <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={fetchProperties} className="btn-primary">Apply Filters</button>
            <button onClick={clearFilters} className="btn-secondary">Clear All</button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="properties-container">
          <div className="properties-header">
            <h3>{properties.length > 0 ? `${properties.length} Properties Found` : 'No Properties Found'}</h3>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading properties...</p>
            </div>
          ) : (
            <>
              <div className="properties-grid">
                {properties.map(property => (
                  <div
                    key={property._id}
                    className="property-card"
                    onClick={() => handlePropertyClick(property._id)}
                  >
                    <div className="property-image">
                      <img
                        src={
                          property.images && property.images.length > 0 
                            ? (property.images[0].url || property.images[0])
                            : '/img/placeholder.jpg'
                        }
                        alt={property.name}
                        onError={(e) => { 
                          console.log('Image failed to load:', e.target.src);
                          e.target.src = '/img/placeholder.jpg'; 
                        }}
                      />
                      {property.featured && <span className="badge-featured">Featured</span>}
                      {property.verified && <span className="badge-verified">✓ Verified</span>}
                    </div>

                    <div className="property-details">
                      <div className="property-header">
                        <h3>{property.name}</h3>
                        <span className="property-type">{property.type}</span>
                      </div>

                      <div className="property-location">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{property.location.city}, {property.location.district}</span>
                      </div>

                      <div className="property-rating">
                        <div className="stars">
                          {'★'.repeat(Math.round(property.ratings.average))}
                          {'☆'.repeat(5 - Math.round(property.ratings.average))}
                        </div>
                        <span>({property.ratings.count} reviews)</span>
                      </div>

                      <p className="property-description">
                        {property.description.short}
                      </p>

                      <div className="property-amenities">
                        {property.amenities.basic.slice(0, 3).map((amenity, index) => (
                          <span key={index} className="amenity-tag">{amenity}</span>
                        ))}
                        {property.amenities.basic.length > 3 && (
                          <span className="amenity-more">+{property.amenities.basic.length - 3} more</span>
                        )}
                      </div>

                      <div className="property-footer">
                        <div className="property-price">
                          <span className="price-label">From</span>
                          <span className="price-amount">₹{property.pricing.basePrice}</span>
                          <span className="price-unit">/night</span>
                        </div>
                        <button className="btn-book">View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-page"
                  >
                    Previous
                  </button>
                  <span className="page-info">Page {page} of {totalPages}</span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn-page"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PropertyListing;
