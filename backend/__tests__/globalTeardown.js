const mongoose = require('mongoose');

module.exports = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  
  if (global.__MONGOINSTANCE) {
    await global.__MONGOINSTANCE.stop();
  }
  
  console.log('MongoDB Memory Server stopped');
};
