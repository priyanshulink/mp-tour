# MP Tourism Homestay Booking System - Complete Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Documentation](#api-documentation)
5. [User Booking Pipeline](#user-booking-pipeline)
6. [Payment Pipeline](#payment-pipeline)
7. [Admin Pipeline](#admin-pipeline)
8. [Deployment Guide](#deployment-guide)

---

## System Overview

### Purpose
Complete production-ready online booking system for MP Tourism (Madhya Pradesh Tourism Development) supporting homestays, hotels, resorts, heritage properties, and eco-tourism lodges.

### Technology Stack
- **Frontend**: React.js with Vite
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Payment Gateway**: Razorpay
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer
- **Cron Jobs**: node-cron

### Key Features
- Real-time availability checking
- Secure payment processing with Razorpay
- Dynamic pricing (seasonal, weekend rates)
- Inventory locking during payment
- Automated booking lifecycle management
- Admin dashboard with analytics
- Refund management
- Email notifications

---

## Architecture

### System Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│  - Property Listing  - Booking Flow  - Payment Integration  │
│  - User Dashboard    - Admin Panel   - Real-time Updates    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Express)                     │
│  - Authentication   - Authorization  - Request Validation    │
│  - Rate Limiting    - CORS          - Error Handling         │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
┌──────────────────┐       ┌──────────────────┐
│   CONTROLLERS    │       │   MIDDLEWARE     │
│  - Property      │       │  - Auth          │
│  - Booking       │◄──────┤  - Upload        │
│  - Payment       │       │  - Validation    │
│  - Admin         │       │  - Error Handler │
└────────┬─────────┘       └──────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (MongoDB)                         │
│  - Properties    - Bookings     - Payments                   │
│  - Users         - Availability - Cancellations              │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
┌──────────────────┐       ┌──────────────────┐
│  EXTERNAL APIs   │       │   CRON JOBS      │
│  - Razorpay      │       │  - Lock Cleanup  │
│  - Email Service │       │  - Reminders     │
│  - SMS Gateway   │       │  - Reports       │
└──────────────────┘       └──────────────────┘
```

### Role-Based Access Control

```
┌──────────────┐
│    ADMIN     │ → Full system access, property approval, reports
└──────────────┘

┌──────────────┐
│ PROPERTY     │ → Property management, booking view, availability
│   OWNER      │
└──────────────┘

┌──────────────┐
│    USER      │ → Browse, book, view bookings, cancel
│  (Tourist)   │
└──────────────┘
```

---

## Database Schema

### 1. Property Model

```javascript
{
  propertyId: String (unique),
  name: String,
  type: ['homestay', 'hotel', 'resort', 'heritage', 'eco-lodge'],
  category: ['budget', 'standard', 'premium', 'luxury'],
  
  location: {
    city: String,
    district: String,
    tourismCircuit: ['Chambal', 'Bundelkhand', 'Mahakaushal', 'Malwa', 'Nimar', 'Vindhya'],
    address: String,
    coordinates: { latitude, longitude }
  },
  
  rooms: [{
    roomType: String,
    capacity: Number,
    totalRooms: Number,
    basePrice: Number,
    amenities: [String]
  }],
  
  pricing: {
    basePrice: Number,
    seasonalRates: [{
      season: String,
      multiplier: Number,
      startDate: Date,
      endDate: Date
    }],
    weekendMultiplier: Number,
    taxes: { gst: Number, tourismFee: Number }
  },
  
  policies: {
    checkIn: String,
    checkOut: String,
    cancellation: {
      fullRefund: Number,    // days before check-in
      partialRefund: Number,
      refundPercentage: Number
    }
  },
  
  approval: {
    status: ['pending', 'approved', 'rejected', 'suspended'],
    verifiedAt: Date,
    verifiedBy: ObjectId
  }
}
```

### 2. Booking Model

```javascript
{
  bookingId: String (unique, format: MPT2401XXXX),
  userId: ObjectId,
  propertyId: ObjectId,
  
  guestDetails: {
    name: String,
    email: String,
    phone: String,
    adults: Number,
    children: Number
  },
  
  checkIn: Date,
  checkOut: Date,
  nights: Number,
  
  rooms: [{
    roomType: String,
    quantity: Number,
    pricePerNight: Number
  }],
  
  pricing: {
    baseAmount: Number,
    seasonalCharge: Number,
    weekendCharge: Number,
    subtotal: Number,
    gst: Number,
    totalAmount: Number
  },
  
  status: ['initiated', 'pending', 'confirmed', 'checked-in', 'checked-out', 'completed', 'cancelled', 'failed'],
  
  inventoryLock: {
    isLocked: Boolean,
    lockedAt: Date,
    expiresAt: Date
  },
  
  paymentId: ObjectId,
  paymentStatus: ['pending', 'processing', 'completed', 'failed']
}
```

### 3. Payment Model

```javascript
{
  paymentId: String (unique),
  bookingId: ObjectId,
  userId: ObjectId,
  
  amount: {
    currency: 'INR',
    total: Number,
    paid: Number,
    refunded: Number
  },
  
  gateway: {
    provider: ['razorpay', 'paytm', 'ccavenue', 'government-gateway'],
    orderId: String,
    transactionId: String,
    paymentMethod: String
  },
  
  status: ['created', 'pending', 'success', 'failed', 'refunded'],
  
  verification: {
    isVerified: Boolean,
    verifiedAt: Date,
    signature: String
  },
  
  refunds: [{
    refundId: String,
    amount: Number,
    reason: String,
    status: String,
    completedAt: Date
  }]
}
```

### 4. Availability Model

```javascript
{
  propertyId: ObjectId,
  date: Date,
  
  rooms: [{
    roomType: String,
    totalRooms: Number,
    availableRooms: Number,
    bookedRooms: Number
  }],
  
  totalCapacity: Number,
  availableCapacity: Number,
  
  locks: [{
    bookingId: ObjectId,
    roomType: String,
    quantity: Number,
    lockedAt: Date,
    expiresAt: Date,
    status: ['active', 'expired', 'released', 'confirmed']
  }],
  
  isBlocked: Boolean
}
```

### 5. Cancellation Model

```javascript
{
  cancellationId: String (unique),
  bookingId: ObjectId,
  userId: ObjectId,
  cancelledBy: ['user', 'admin', 'system', 'property-owner'],
  
  reason: {
    category: String,
    description: String
  },
  
  refund: {
    originalAmount: Number,
    cancellationCharges: Number,
    refundableAmount: Number,
    status: ['pending', 'processing', 'completed'],
    expectedCompletionDate: Date
  }
}
```

---

## API Documentation

### Base URL
```
Production: https://api.mptourism.gov.in
Development: http://localhost:5000/api
```

### Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### API Endpoints

#### 1. Property Management

##### GET /api/properties
**Description**: Get all properties with filters  
**Access**: Public  
**Query Parameters**:
- `city` (string): Filter by city
- `type` (string): Filter by property type
- `category` (string): Filter by category
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `checkIn` (date): Check-in date
- `checkOut` (date): Check-out date
- `guests` (number): Number of guests
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 20)
- `sortBy` (string): Sort criteria

**Response**:
```json
{
  "success": true,
  "count": 12,
  "total": 150,
  "page": 1,
  "pages": 8,
  "data": [
    {
      "_id": "property_id",
      "name": "Heritage Homestay",
      "type": "homestay",
      "location": {
        "city": "Bhopal",
        "district": "Bhopal"
      },
      "pricing": {
        "basePrice": 2500
      },
      "ratings": {
        "average": 4.5,
        "count": 120
      }
    }
  ]
}
```

##### GET /api/properties/:id
**Description**: Get single property details  
**Access**: Public  
**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "property_id",
    "name": "Heritage Homestay",
    "description": {
      "short": "Beautiful heritage property",
      "detailed": "Full description..."
    },
    "rooms": [...],
    "amenities": {...},
    "policies": {...}
  }
}
```

##### POST /api/properties/:id/check-availability
**Description**: Check property availability for dates  
**Access**: Public  
**Request Body**:
```json
{
  "checkIn": "2024-03-15",
  "checkOut": "2024-03-18",
  "guests": 2,
  "roomType": "Deluxe Room"
}
```
**Response**:
```json
{
  "success": true,
  "available": true,
  "pricing": {
    "nights": 3,
    "baseAmount": 7500,
    "seasonalCharge": 0,
    "weekendCharge": 1000,
    "subtotal": 8500,
    "gst": 1020,
    "totalAmount": 9520
  }
}
```

##### POST /api/properties
**Description**: Create new property  
**Access**: Private (Admin/Property Owner)  
**Request Body**:
```json
{
  "name": "New Heritage Property",
  "type": "heritage",
  "category": "premium",
  "location": {
    "city": "Bhopal",
    "district": "Bhopal",
    "tourismCircuit": "Malwa",
    "address": "123 Main Street",
    "pincode": "462001"
  },
  "rooms": [...],
  "pricing": {...},
  "amenities": {...},
  "policies": {...}
}
```

#### 2. Booking Management

##### POST /api/bookings
**Description**: Create new booking  
**Access**: Private  
**Request Body**:
```json
{
  "propertyId": "property_id",
  "checkIn": "2024-03-15",
  "checkOut": "2024-03-18",
  "guestDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "adults": 2,
    "children": 0
  },
  "rooms": [
    {
      "roomType": "Deluxe Room",
      "quantity": 1,
      "pricePerNight": 2500
    }
  ]
}
```
**Response**:
```json
{
  "success": true,
  "message": "Booking initiated successfully",
  "data": {
    "bookingId": "MPT2401XXXX",
    "status": "initiated",
    "pricing": {...},
    "inventoryLock": {
      "expiresAt": "2024-03-10T10:45:00Z"
    }
  },
  "expiresIn": 900
}
```

##### GET /api/bookings/:id
**Description**: Get booking details  
**Access**: Private (Owner/Admin)  
**Response**:
```json
{
  "success": true,
  "data": {
    "bookingId": "MPT2401XXXX",
    "status": "confirmed",
    "property": {...},
    "pricing": {...},
    "paymentStatus": "completed"
  }
}
```

##### GET /api/bookings/user/my-bookings
**Description**: Get user's bookings  
**Access**: Private  
**Query Parameters**:
- `status` (string): Filter by status
- `page` (number): Page number
- `limit` (number): Results per page

**Response**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "bookingId": "MPT2401XXXX",
      "property": {...},
      "checkIn": "2024-03-15",
      "checkOut": "2024-03-18",
      "status": "confirmed"
    }
  ]
}
```

##### PUT /api/bookings/:id/cancel
**Description**: Cancel booking  
**Access**: Private  
**Request Body**:
```json
{
  "reason": "Change of plans",
  "category": "user-request"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "booking": {...},
    "cancellation": {...},
    "refundAmount": 7500
  }
}
```

#### 3. Payment Processing

##### POST /api/payments/create-order
**Description**: Create payment order  
**Access**: Private  
**Request Body**:
```json
{
  "bookingId": "booking_id"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "orderId": "order_xyz123",
    "amount": 952000,
    "currency": "INR",
    "key": "rzp_live_xxxxx"
  }
}
```

##### POST /api/payments/verify
**Description**: Verify payment after completion  
**Access**: Private  
**Request Body**:
```json
{
  "razorpay_order_id": "order_xyz123",
  "razorpay_payment_id": "pay_abc456",
  "razorpay_signature": "signature_hash",
  "paymentId": "payment_id"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "payment": {...},
    "booking": {
      "status": "confirmed"
    }
  }
}
```

##### POST /api/payments/:id/refund
**Description**: Initiate refund  
**Access**: Private (Admin)  
**Request Body**:
```json
{
  "amount": 7500,
  "reason": "Booking cancellation"
}
```

#### 4. Admin Operations

##### GET /api/admin/dashboard
**Description**: Get dashboard statistics  
**Access**: Private (Admin)  
**Query Parameters**:
- `startDate` (date): Start date for stats
- `endDate` (date): End date for stats

**Response**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalProperties": 150,
      "pendingApprovals": 12,
      "totalBookings": 1250,
      "totalRevenue": 15000000,
      "occupancyRate": 68.5
    },
    "bookingTrends": [...],
    "topProperties": [...],
    "revenueByType": [...]
  }
}
```

##### PUT /api/admin/properties/:id/approve
**Description**: Approve property  
**Access**: Private (Admin)  
**Request Body**:
```json
{
  "remarks": "Property verified and approved"
}
```

##### GET /api/admin/reports/revenue
**Description**: Get revenue report  
**Access**: Private (Admin)  
**Query Parameters**:
- `startDate` (date): Report start date
- `endDate` (date): Report end date
- `groupBy` (string): 'day', 'week', or 'month'

**Response**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 5000000,
      "totalBookings": 450,
      "averageBookingValue": 11111
    },
    "timeline": [...],
    "propertyBreakdown": [...]
  }
}
```

---

## User Booking Pipeline

### Step-by-Step Booking Flow

```
1. PROPERTY DISCOVERY
   ├─ User browses properties with filters
   ├─ View property details
   └─ Select dates and check availability

2. AVAILABILITY CHECK
   ├─ System checks availability for date range
   ├─ Validates inventory
   ├─ Calculates dynamic pricing
   └─ Returns availability + pricing

3. BOOKING INITIATION
   ├─ User enters guest details
   ├─ System creates booking (status: INITIATED)
   ├─ Locks inventory for 15 minutes
   └─ Generates booking ID

4. PAYMENT PROCESSING
   ├─ Create Razorpay order
   ├─ Update booking status to PENDING
   ├─ User completes payment
   └─ Verify payment signature

5. BOOKING CONFIRMATION
   ├─ Verify payment with gateway
   ├─ Update booking status to CONFIRMED
   ├─ Convert inventory lock to confirmed
   ├─ Send confirmation email
   └─ Update property statistics

6. CHECK-IN/CHECK-OUT
   ├─ Property owner checks in guest
   ├─ Update status to CHECKED-IN
   ├─ Property owner checks out guest
   └─ Update status to COMPLETED

7. POST-BOOKING
   ├─ Request feedback/review
   └─ Archive completed booking
```

### Booking Status Lifecycle

```
INITIATED → User creates booking
    ↓
PENDING → Payment initiated
    ↓
CONFIRMED → Payment successful
    ↓
CHECKED-IN → Guest checked in
    ↓
CHECKED-OUT → Guest checked out
    ↓
COMPLETED → Booking completed

Alternative flows:
INITIATED/PENDING → FAILED (payment failed/expired)
ANY → CANCELLED (user/admin cancellation)
```

---

## Payment Pipeline

### Payment Flow Diagram

```
1. CREATE ORDER
   ├─ Validate booking
   ├─ Create Razorpay order
   ├─ Save payment record (status: CREATED)
   └─ Return order details to frontend

2. USER PAYMENT
   ├─ Frontend opens Razorpay checkout
   ├─ User selects payment method
   ├─ User completes payment
   └─ Razorpay returns payment details

3. PAYMENT VERIFICATION
   ├─ Frontend sends payment details
   ├─ Backend verifies signature
   ├─ Validate with Razorpay API
   ├─ Update payment status
   └─ Confirm booking

4. SETTLEMENT
   ├─ Razorpay processes settlement
   ├─ Funds transferred to merchant
   └─ Update settlement status

5. REFUND (if needed)
   ├─ Create refund request
   ├─ Process through Razorpay
   ├─ Update refund status
   └─ Notify user
```

### Payment Security

1. **Signature Verification**: All payments verified using HMAC SHA256
2. **HTTPS Only**: All payment communication over HTTPS
3. **PCI DSS Compliance**: Payment data never stored directly
4. **3D Secure**: Supported for card payments
5. **Webhook Verification**: Webhook signatures verified

### Refund Policy Implementation

```javascript
calculateRefund(checkInDate, totalAmount, policy) {
  daysUntilCheckIn = calculateDays(now, checkInDate);
  
  if (daysUntilCheckIn >= policy.fullRefund) {
    return 100% refund (minus processing fees)
  } else if (daysUntilCheckIn >= policy.partialRefund) {
    return policy.refundPercentage% refund
  } else {
    return 0% refund
  }
}
```

---

## Admin Pipeline

### Property Management

```
1. PROPERTY SUBMISSION
   ├─ Owner submits property details
   ├─ System creates property (status: PENDING)
   └─ Notify admin

2. ADMIN REVIEW
   ├─ Admin reviews property details
   ├─ Verify documents
   ├─ Check compliance
   └─ Decision: Approve/Reject

3. APPROVAL
   ├─ Update status to APPROVED
   ├─ Activate property
   ├─ Initialize availability calendar
   └─ Notify owner

4. ONGOING MANAGEMENT
   ├─ Monitor bookings
   ├─ Handle disputes
   ├─ Update pricing
   └─ Manage availability
```

### Reports & Analytics

#### Revenue Report
- Total revenue by period
- Property-wise breakdown
- Payment method distribution
- Refund statistics

#### Occupancy Report
- Overall occupancy rate
- Property-wise occupancy
- Seasonal trends
- Popular destinations

#### Booking Report
- Total bookings
- Cancellation rate
- Average booking value
- Lead time analysis

---

## Deployment Guide

### Prerequisites
- Node.js 16+ and npm
- MongoDB 5.0+
- Domain with SSL certificate
- Razorpay account
- SMTP email service

### Environment Variables

Create `.env` file in server directory:

```env
# Server
NODE_ENV=production
PORT=5000
CLIENT_URL=https://mptourism.gov.in
FRONTEND_URL=https://mptourism.gov.in

# Database
MONGODB_URI=mongodb://localhost:27017/mp_tourism

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key
RAZORPAY_WEBHOOK_SECRET=webhook_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=notifications@mptourism.gov.in
SMTP_PASS=your_email_password
SMTP_FROM=noreply@mptourism.gov.in

# File Upload
MAX_FILE_SIZE=5242880
```

### Installation Steps

#### 1. Server Setup

```bash
# Navigate to server directory
cd mern-app/server

# Install dependencies
npm install

# Install additional packages
npm install razorpay node-cron nodemailer

# Run database migrations (if any)
npm run migrate

# Start server
npm start

# For production with PM2
npm install -g pm2
pm2 start app.js --name "mp-tourism-api"
pm2 save
pm2 startup
```

#### 2. Frontend Setup

```bash
# Navigate to client directory
cd mern-app/client

# Install dependencies
npm install

# Build for production
npm run build

# Serve with nginx or deploy to CDN
```

#### 3. Database Setup

```bash
# Start MongoDB
mongod --dbpath /var/lib/mongodb

# Import initial data (optional)
mongoimport --db mp_tourism --collection properties --file properties.json

# Create indexes
mongo mp_tourism --eval "db.properties.createIndex({'location.city': 1, type: 1})"
mongo mp_tourism --eval "db.bookings.createIndex({bookingId: 1})"
mongo mp_tourism --eval "db.availability.createIndex({propertyId: 1, date: 1})"
```

#### 4. Nginx Configuration

```nginx
server {
    listen 80;
    server_name api.mptourism.gov.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.mptourism.gov.in;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Frontend
server {
    listen 443 ssl http2;
    server_name mptourism.gov.in;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/mp-tourism/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] SSL certificates installed
- [ ] Razorpay account configured
- [ ] Email service tested
- [ ] Cron jobs running
- [ ] Backup system in place
- [ ] Monitoring tools setup
- [ ] Error logging configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Load testing completed
- [ ] Security audit performed

### Monitoring

```bash
# Server logs
pm2 logs mp-tourism-api

# Database monitoring
mongostat

# Application monitoring
npm install --save @sentry/node
# Configure Sentry in app.js

# Uptime monitoring
# Use services like UptimeRobot, Pingdom
```

### Backup Strategy

```bash
# Daily database backup
0 2 * * * mongodump --db mp_tourism --out /backups/$(date +\%Y-\%m-\%d)

# Weekly backup to cloud storage
0 3 * * 0 aws s3 sync /backups s3://mp-tourism-backups
```

---

## Security Considerations

1. **Authentication**: JWT with HttpOnly cookies
2. **Authorization**: Role-based access control
3. **Input Validation**: All inputs validated and sanitized
4. **SQL Injection**: Using Mongoose ORM prevents injection
5. **XSS Protection**: Content Security Policy headers
6. **CSRF Protection**: CSRF tokens for state-changing operations
7. **Rate Limiting**: API rate limiting to prevent abuse
8. **Data Encryption**: Sensitive data encrypted at rest
9. **Audit Logging**: All admin actions logged
10. **Regular Updates**: Dependencies updated regularly

---

## Support & Maintenance

### Contact
- Technical Support: tech@mptourism.gov.in
- Admin Portal: https://admin.mptourism.gov.in
- Documentation: https://docs.mptourism.gov.in

### Maintenance Schedule
- Weekly: Security updates
- Monthly: Feature updates
- Quarterly: Major releases

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**License**: Government of Madhya Pradesh
