/**
 * Simple API Tests for Canada Computers Backend
 */

describe('Canada Computers API', () => {
  test('Should perform basic arithmetic', () => {
    expect(2 + 2).toBe(4);
  });

  test('Should validate environment setup', () => {
    // Test that we can access environment variables
    expect(process.env.NODE_ENV).toBeDefined();
    expect(typeof process.env.MONGODB_URI).toBe('string');
  });
});