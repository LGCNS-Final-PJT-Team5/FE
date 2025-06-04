let storage = {};

const AsyncStorage = {
  setItem: jest.fn((key, value) => {
    return new Promise((resolve) => {
      storage[key] = value;
      resolve(null);
    });
  }),
  
  getItem: jest.fn((key) => {
    return new Promise((resolve) => {
      resolve(storage[key] || null);
    });
  }),
  
  removeItem: jest.fn((key) => {
    return new Promise((resolve) => {
      delete storage[key];
      resolve(null);
    });
  }),
  
  clear: jest.fn(() => {
    return new Promise((resolve) => {
      storage = {};
      resolve(null);
    });
  }),
  
  getAllKeys: jest.fn(() => {
    return new Promise((resolve) => {
      resolve(Object.keys(storage));
    });
  }),
  
  multiGet: jest.fn((keys) => {
    return new Promise((resolve) => {
      const result = keys.map(key => [key, storage[key] || null]);
      resolve(result);
    });
  }),
  
  multiSet: jest.fn((keyValuePairs) => {
    return new Promise((resolve) => {
      keyValuePairs.forEach(([key, value]) => {
        storage[key] = value;
      });
      resolve(null);
    });
  }),
};

export default AsyncStorage;