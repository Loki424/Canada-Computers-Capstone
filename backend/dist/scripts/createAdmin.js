"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://capstone123:capstone123@cluster0.2y2ujpq.mongodb.net/canadacomputers';
async function createAdminUser() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        // Check if admin user already exists
        const existingAdmin = await User_1.User.findOne({ email: 'admin@canadacomputers.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }
        // Create admin user
        const hashedPassword = await bcryptjs_1.default.hash('admin', 10);
        const adminUser = await User_1.User.create({
            name: 'Admin User',
            email: 'admin@canadacomputers.com',
            password_hash: hashedPassword,
            role: 'admin'
        });
        console.log('Admin user created successfully:', adminUser.email);
        process.exit(0);
    }
    catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}
createAdminUser();
//# sourceMappingURL=createAdmin.js.map