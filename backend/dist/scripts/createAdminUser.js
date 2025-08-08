"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
dotenv_1.default.config();
async function createAdminUser() {
    try {
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/canada-computers';
        console.log('Connecting to MongoDB...');
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        // Check if admin user already exists
        const existingAdmin = await User_1.User.findOne({ email: 'admin@canadacomputers.com' });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('Updated existing user to admin role');
            }
        }
        else {
            // Create admin user
            console.log('Creating admin user...');
            const hashedPassword = await bcryptjs_1.default.hash('admin', 10);
            const adminUser = new User_1.User({
                name: 'Admin User',
                email: 'admin@canadacomputers.com',
                password_hash: hashedPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log('Admin user created successfully!');
            console.log('Email: admin@canadacomputers.com');
            console.log('Password: admin');
            console.log('Role: admin');
        }
    }
    catch (error) {
        console.error('Error creating admin user:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}
createAdminUser();
//# sourceMappingURL=createAdminUser.js.map