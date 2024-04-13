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

async function countTweets() {
    // Connect to MongoDB
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db(dbName);
    
    // Query MongoDB to get the total number of tweets
    const totalTweets = await db.collection(collectionName).estimatedDocumentCount();

    // Initialize tweetCount to 0
    redisClient.set('tweetCount', 0);

    // Increase tweetCount for each document
    for (let i = 0; i < totalTweets; i++) {
        const tweet = await db.collection(collectionName).findOne({}, { skip: i });
        redisClient.incr('tweetCount');
    }
    
    // Get the final tweet count
    let tweetCount = await redisClient.get('tweetCount');
    
    // Print the tweet count to the console
    console.log(`There were ${tweetCount} tweets`);
    
    client.close();
}

countTweets();
