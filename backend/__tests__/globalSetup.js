const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

module.exports = async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'test_db'
    }
  });
  
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
  
  // Store mongoServer instance for teardown
  global.__MONGOINSTANCE = mongoServer;
  global.__MONGOURI = mongoUri;
  
  console.log('MongoDB Memory Server started');
};
