// Dummy Redis client - No actual connection
const dummyRedisClient = {
  async get(key) {
    return null;
  },
  
  async setEx(key, seconds, value) {
    return null;
  },
  
  async del(key) {
    return null;
  }
};

console.log('⚠️  Redis disabled - Running without cache');

module.exports = dummyRedisClient;
