// Test environment setup
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config();

// Set test-specific environment variables
process.env.NODE_ENV = 'test';
process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key';
process.env.JWT_SECRET = 'test-secret-key-for-testing';
