import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

// Load environmental parameters
dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-resume-analyzer';
    console.log(`[Seeder] Connecting to MongoDB: ${mongoUri}...`);
    
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected successfully.');

    const targetEmail = 'pdevrukhakar491@gmail.com';
    let user = await User.findOne({ email: targetEmail });

    if (user) {
      console.log(`[Seeder] User with email '${targetEmail}' already exists. Escalating role to 'admin'...`);
      user.role = 'admin';
      await user.save();
      console.log(`[Seeder] Escalate successful! User '${user.username}' is now an Admin.`);
    } else {
      console.log(`[Seeder] Creating a new Admin account for '${targetEmail}'...`);
      const defaultPassword = 'adminpassword123';
      
      user = await User.create({
        username: 'admin_prathamesh',
        email: targetEmail,
        password: defaultPassword,
        role: 'admin',
      });
      
      console.log('\n======================================================');
      console.log('[Seeder] Admin account seeded successfully!');
      console.log(`- Username: ${user.username}`);
      console.log(`- Email   : ${user.email}`);
      console.log(`- Password: ${defaultPassword}`);
      console.log('======================================================\n');
    }

    await mongoose.disconnect();
    console.log('[Seeder] Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder] Critical seeding failure:', error.message);
    process.exit(1);
  }
};

seedAdmin();
