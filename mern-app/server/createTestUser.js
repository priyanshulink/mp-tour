const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mp-tourism', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const createTestUser = async () => {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists:');
      console.log('Email: test@example.com');
      console.log('Password: Test@123');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Test@123', salt);

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      phone: '9876543210',
      role: 'User',
      isActive: true
    });

    console.log('✅ Test user created successfully!');
    console.log('\nLogin Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: Test@123');
    console.log('\nYou can now login and test the booking flow!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();
