# 🎯 How to Test the "Book Now" Feature

## ✅ Prerequisites Completed
- ✅ Backend server running on port 5000
- ✅ Frontend server running on port 5173
- ✅ MongoDB connected with 8 demo properties
- ✅ Test user created

## 📝 Test User Credentials
```
Email: test@example.com
Password: Test@123
```

## 🔄 Complete Booking Flow Test

### Step 1: Open the Website
1. Open your browser
2. Go to: **http://localhost:5173/**
3. You should see the home page

### Step 2: Navigate to Properties
1. Click on "Book Stay" in the navigation bar
   - OR go directly to: **http://localhost:5173/properties**
2. You should see 8 properties listed (Royal Heritage Palace, Mahakaushal Eco Lodge, etc.)

### Step 3: View Property Details
1. Click on any property card (e.g., "Royal Heritage Palace")
2. You should see:
   - Property images and gallery
   - Room types and amenities
   - Description and policies
   - Booking section on the right sidebar

### Step 4: Check Availability
1. In the booking sidebar (right side), fill in:
   - **Check-in date**: Select any future date (e.g., tomorrow)
   - **Check-out date**: Select a date after check-in (e.g., 2 days from check-in)
   - **Room Type**: Select from dropdown (e.g., "Deluxe")
   - **Adults**: 2 (default)
   - **Children**: 0 (default)
2. Click **"Check Availability"** button
3. You should see:
   - ✓ "Available for booking" message
   - Price breakdown showing:
     - Base Price (X nights)
     - Seasonal Charge (if applicable)
     - Weekend Charge (if applicable)
     - GST
     - Total Amount
   - **"Book Now"** button appears below the price

### Step 5: Click Book Now (Not Logged In)
1. Click the **"Book Now"** button
2. Since you're not logged in, you should be:
   - **Redirected to Login page** (http://localhost:5173/login)

### Step 6: Login
1. On the login page, enter:
   - Email: **test@example.com**
   - Password: **Test@123**
2. Click **Login** button
3. After successful login, you may be redirected to home page

### Step 7: Repeat Steps 3-4
1. Go back to **http://localhost:5173/properties**
2. Click on a property again
3. Fill in booking dates and check availability
4. Click **"Book Now"** (now you're logged in)

### Step 8: Booking Checkout Page
You should now see the **Booking Checkout** page with:

**Left Side:**
- Guest Details Form (pre-filled with your info):
  - Full Name: Test User
  - Email: test@example.com
  - Phone Number
  - Address (optional)
  - Special Requests (optional)

**Right Side:**
- Booking Summary Card showing:
  - Property details
  - Check-in/Check-out dates
  - Number of guests
  - Selected room type
- Price Breakdown Card
- Policies Card
- **"Confirm & Pay"** button

### Step 9: Complete Booking
1. Fill in any missing details if needed
2. Click **"Confirm & Pay"** button
3. Razorpay payment modal should open

### Step 10: Make Test Payment
In the Razorpay modal:
1. Use test card details:
   - **Card Number**: 4111 1111 1111 1111
   - **Expiry**: Any future date (e.g., 12/25)
   - **CVV**: Any 3 digits (e.g., 123)
   - **Name**: Any name
2. Click **Pay** button

### Step 11: Booking Success
You should be redirected to **Booking Success** page showing:
- ✅ Success icon with animation
- Booking confirmation message
- Booking details:
  - Booking ID
  - Property name
  - Check-in/Check-out dates
  - Number of guests
  - Total amount paid
- Next steps guide
- Action buttons:
  - View My Bookings
  - Browse More Properties
  - Go to Home

## 🐛 Troubleshooting

### Issue: "Book Now" button not showing
**Solution:**
- Make sure you clicked "Check Availability" first
- Ensure the dates selected show "Available for booking"
- Check that you selected valid check-in and check-out dates

### Issue: Clicking "Book Now" does nothing
**Possible causes:**
1. **Not logged in** - You'll be redirected to /login
2. **No availability checked** - Check availability first
3. **Console errors** - Open browser console (F12) and check for errors

### Issue: Login fails
**Solution:**
- Ensure test user was created (check terminal output)
- Use exact credentials:
  - Email: test@example.com
  - Password: Test@123
- Check backend server is running (port 5000)

### Issue: Redirected back to properties after clicking "Book Now"
**Solution:**
- This means booking data wasn't passed correctly
- Try these steps:
  1. Clear browser cache (Ctrl+Shift+Delete)
  2. Refresh the page (Ctrl+F5)
  3. Log out and log in again
  4. Repeat the booking process

### Issue: Payment modal doesn't open
**Solution:**
- Check browser console for JavaScript errors
- Ensure Razorpay script is loaded (check index.html)
- Verify internet connection (Razorpay CDN needs to load)

### Issue: After payment, nothing happens
**Solution:**
- Check backend terminal for errors
- Check browser console for errors
- Verify backend API is responding (check Network tab in DevTools)

## 🔍 Debug Checklist

If something isn't working:

1. ✅ Check both servers are running:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173

2. ✅ Check browser console (F12 > Console tab):
   - Look for red error messages
   - Common errors: 401 (not authenticated), 404 (route not found), 500 (server error)

3. ✅ Check backend terminal:
   - Look for API request logs
   - Check for error messages

4. ✅ Check Network tab (F12 > Network):
   - See which API calls are being made
   - Check if they're returning 200 (success) or errors

5. ✅ Verify you're logged in:
   - Check localStorage in DevTools (Application > Local Storage)
   - Should have a 'token' entry

## 📞 Common API Endpoints Used

- `GET /api/properties` - List all properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties/:id/check-availability` - Check availability
- `POST /api/bookings` - Create booking
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

## ✨ Expected Behavior

**Working correctly when:**
- ✅ Properties load on /properties page
- ✅ Property details load with images and info
- ✅ Availability check shows price breakdown
- ✅ "Book Now" button is clickable and navigates correctly
- ✅ Login redirects back to booking flow
- ✅ Checkout page shows all booking details
- ✅ Payment modal opens with Razorpay
- ✅ Success page shows after payment
- ✅ Booking is saved in database

---

## 🎉 Success Indicators

You'll know everything is working when you:
1. Can browse properties
2. Can check availability and see pricing
3. Get redirected to login if not authenticated
4. Can access checkout page after logging in
5. See Razorpay payment modal
6. Land on success page after payment
7. See booking confirmation details

If you're stuck at any step, check the troubleshooting section above!
