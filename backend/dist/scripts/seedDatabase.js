"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Category_1 = require("../models/Category");
const Product_1 = require("../models/Product");
const categories_json_1 = __importDefault(require("../seed/categories.json"));
const products_json_1 = __importDefault(require("../seed/products.json"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/canada-computers';
async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        // Clear existing data
        await Category_1.Category.deleteMany({});
        await Product_1.Product.deleteMany({});
        console.log('Cleared existing data');
        // Insert categories
        await Category_1.Category.insertMany(categories_json_1.default);
        console.log('Categories inserted');
        // Insert products
        await Product_1.Product.insertMany(products_json_1.default);
        console.log('Products inserted');
        console.log('Database seeded successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
//# sourceMappingURL=seedDatabase.js.map