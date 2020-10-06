export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({
      id: '1234fakeid',
    }),
  },
};

// Mock Resolved Value: We'll get back promise that automatically resolve itself with an empty object
// In route handler, when we call create, we are going to get back a promise, and await that promise to be resolved
