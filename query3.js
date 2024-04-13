const MongoClient = require('mongodb').MongoClient;
const Redis = require('ioredis');

// Connection URLs for MongoDB and Redis
const mongoUrl = 'mongodb://localhost:27017';
const redisUrl = 'redis://localhost:6379';

// Database and collection names
// Assumes that the database and collection names are both 'hw5'
// Otherwise, change to other desired names
const dbName = 'hw5';
const collectionName = 'hw5'

// Initialize Redis client
const redisClient = new Redis(redisUrl);

async function setDistinctScreenNames() {
    // Connect to MongoDB
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db(dbName);
    
     // Get distinct screen names from MongoDB
     const distinctScreenNames = await db.collection(collectionName).distinct('user.screen_name');

     // Add distinct screen names to Redis set
     await redisClient.sadd('screenNames', distinctScreenNames);
    
    client.close();
}

setDistinctScreenNames();
