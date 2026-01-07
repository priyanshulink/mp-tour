const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Import models
const User = require('./models/User');
const Event = require('./models/Event');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected for seeding'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@mpheritage.com',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'Admin'
    });
    console.log('✅ Admin user created:', admin.email);

    // Create Regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await User.create({
      name: 'Demo User',
      email: 'user@mpheritage.com',
      password: 'user123', // Will be hashed by pre-save hook
      role: 'User'
    });
    console.log('✅ Regular user created:', user.email);

    // Create sample events
    const events = [
      // --- Winter (Nov - Feb) ---
      {
        title: 'Lokrang Festival',
        description: 'A five-day cultural extravaganza in Bhopal celebrating folk and tribal arts of India.',
        monastery: 'Bhopal',
        location: 'Ravindra Bhavan, Bhopal',
        date: new Date('2025-01-26'),
        type: 'Cultural',
        image: '/img/events/bhagoria.png', // Fallback/Reuse
        createdBy: admin._id,
        isActive: true
      },
      {
        title: 'Khajuraho Dance Festival',
        description: 'World-renowned week-long celebration of classical Indian dance forms against the backdrop of illuminated temples.',
        monastery: 'Khajuraho Temples',
        location: 'Khajuraho, Chhatarpur District',
        date: new Date('2025-02-20'),
        type: 'Festival',
        image: '/img/events/khajuraho.png',
        createdBy: admin._id,
        isActive: true
      },
      {
        title: 'Mandu Festival',
        description: 'Celebrating the romantic legacy of Mandu with art, craft, music, and adventure activities.',
        monastery: 'Jahaz Mahal',
        location: 'Mandu, Dhar District',
        date: new Date('2025-01-05'),
        type: 'Festival',
        image: '/img/events/mandu.png',
        createdBy: admin._id,
        isActive: true
      },
      {
        title: 'Tansen Music Festival',
        description: 'Oldest and most prestigious classical music festival paying tribute to Mian Tansen.',
        monastery: 'Gwalior Fort',
        location: 'Behat, Gwalior',
        date: new Date('2024-12-15'), // Usually Dec
        type: 'Ceremony',
        image: '/img/events/tansen.png',
        createdBy: admin._id,
        isActive: true
      },
      {
        title: 'Pachmarhi Utsav',
        description: 'A 6-day festival showcasing the folk art and cultural heritage of MP hill station.',
        monastery: 'Pachmarhi',
        location: 'Pachmarhi',
        date: new Date('2024-12-25'), // Usually Dec
        type: 'Festival',
        image: '/img/events/bhagoria.png', // Fallback
        createdBy: admin._id,
        isActive: true
      },
      {
        title: 'Madai Festival',
        description: 'Significant tribal festival of the Gond tribe, honoring the Mother Goddess with music and dance.',
        monastery: 'Mandla/Bastar',
        location: 'Mandla to Bastar Regions',
        date: new Date('2025-02-15'), // 3rd/4th week of Feb
        type: 'Tribal',
        image: '/img/events/bhagoria.png', // Reuse tribal image
        createdBy: admin._id,
        isActive: true
      },
      {
        title: 'Nagaji Fair',
        description: 'Month-long tribal fair honoring Saint Nagaji, featuring cultural exchange and traditional monkey trade history.',
        monastery: 'Morena',
        location: 'Porsa Village, Morena',
        date: new Date('2024-11-15'), // Nov-Dec
        type: 'Tribal',
        image: '/img/events/bhagoria.png', // Reuse tribal image
        createdBy: admin._id,
        isActive: true
      },

      // --- Summer (Mar - Jun) ---
      {
        title: 'Bhagoria Haat Festival',
        description: 'A vibrant tribal festival of the Bhils and Bhilalas, celebrating love and harvest. Known as a marriage market.',
        monastery: 'Jhabua',
        location: 'Jhabua & Alirajpur Districts',
        date: new Date('2025-03-10'),
        type: 'Tribal',
        image: '/img/events/bhagoria.png',
        createdBy: admin._id,
        isActive: true
      },
      {
        title: 'Gair Festival',
        description: 'Powerful expression of tribal unity coinciding with Holi. Men perform the martial Gair dance.',
        monastery: 'Jhabua',
        location: 'Jhabua & Alirajpur',
        date: new Date('2025-03-14'), // Around Holi
        type: 'Tribal',
        image: '/img/events/bhagoria.png', // Reuse tribal image
        createdBy: admin._id,
        isActive: true
      },
      {
        title: 'Malwa Utsav',
        description: 'A festival resonating with the spirit of dance, music, and drama celebrating Malwa culture.',
        monastery: 'Indore',
        location: 'Indore & Ujjain',
        date: new Date('2025-05-25'),
        type: 'Cultural',
        image: '/img/events/mandu.png', // Reuse Mandu image as it's Malwa region
        createdBy: admin._id,
        isActive: true
      },

      // --- Monsoon (Jul - Oct) ---
      {
        title: 'Hareli Festival',
        description: 'Agricultural festival of the Gondi people, worshiping the crop goddess Kutki Dai.',
        monastery: 'Gond Region',
        location: 'Statewide Tribal Areas',
        date: new Date('2025-07-20'), // July/Aug
        type: 'Tribal',
        image: '/img/events/bhagoria.png', // Reuse tribal image
        createdBy: admin._id,
        isActive: true
      },
      {
        title: 'Karma Festival',
        description: 'Major festival of Korba tribes with 24-hour fasting and night-long singing and dancing.',
        monastery: 'Korba Region',
        location: 'Tribal Districts',
        date: new Date('2025-08-15'), // August
        type: 'Tribal',
        image: '/img/events/bhagoria.png', // Reuse tribal image
        createdBy: admin._id,
        isActive: true
      },
      {
        title: 'Mahakaleshwar Sawari',
        description: 'Grand procession of Lord Mahakal held every Monday during the month of Shravan.',
        monastery: 'Mahakaleshwar Temple',
        location: 'Ujjain',
        date: new Date('2025-08-04'),
        type: 'Ceremony',
        image: '/img/events/kumbh_mela.png', // Reuse Ujjain/Spiritual image
        createdBy: admin._id,
        isActive: true
      },
      {
        title: 'Navratri Festival',
        description: 'Nine nights of worship and dance locally known as Garba and Dandiya.',
        monastery: 'Khajuraho Temples',
        location: 'Statewide',
        date: new Date('2025-10-03'),
        type: 'Festival',
        image: '/img/events/khajuraho.png', // Reuse colorful festival image
        createdBy: admin._id,
        isActive: true
      },

      // --- Autumn (Oct - Nov) ---
      {
        title: 'Nimar Utsav',
        description: 'Three-day festival celebrated on the banks of Narmada River under the full moon.',
        monastery: 'Maheshwar',
        location: 'Maheshwar, Khargone',
        date: new Date('2025-11-15'),
        type: 'Festival',
        image: '/img/events/mandu.png', // Reuse river/fort vibe
        createdBy: admin._id,
        isActive: true
      },
      {
        title: 'Chethiyagiri Vihara Festival',
        description: 'A holy Buddhist festival seeing the exhibition of relics of Buddhas chief disciples.',
        monastery: 'Sanchi Stupa',
        location: 'Sanchi, Raisen District',
        date: new Date('2025-11-29'),
        type: 'Ceremony',
        image: '/img/events/sanchi_festival.png',
        createdBy: admin._id,
        isActive: true
      },
      {
        title: 'Akhil Bhartiya Kalidas Samaroh',
        description: 'Literary and cultural festival celebrating the works of the great poet Kalidas.',
        monastery: 'Mahakaleshwar Temple',
        location: 'Ujjain',
        date: new Date('2025-11-20'),
        type: 'Cultural',
        image: '/img/events/tansen.png', // Reuse classical arts image
        createdBy: admin._id,
        isActive: true
      },

      // --- Special/Future ---
      {
        title: 'Simhastha Kumbh Mela',
        description: 'The largest spiritual gathering on Earth, held every 12 years on the banks of Shipra river.',
        monastery: 'Mahakaleshwar Temple',
        location: 'Ujjain',
        date: new Date('2028-04-22'), // Future date
        type: 'Prayer',
        image: '/img/events/kumbh_mela.png',
        createdBy: admin._id,
        isActive: true
      }
    ];

    await Event.insertMany(events);
    console.log('✅ Sample events created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: admin@mpheritage.com / admin123');
    console.log('User: user@mpheritage.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
