import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://capstone123:capstone123@cluster0.2y2ujpq.mongodb.net/canadacomputers';

async function createAdminUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@canadacomputers.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@canadacomputers.com',
      password_hash: hashedPassword,
      role: 'admin'
    });

    console.log('Admin user created successfully:', adminUser.email);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
