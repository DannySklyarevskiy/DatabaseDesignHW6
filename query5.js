const MongoClient = require('mongodb').MongoClient;
const Redis = require('ioredis');

// Connection URLs for MongoDB and Redis
const mongoUrl = 'mongodb://localhost:27017';
const redisUrl = 'redis://localhost:6379';

// Database and collection names
const dbName = 'hw5';
const collectionName = 'hw5';

// Initialize Redis client
const redisClient = new Redis(redisUrl);

async function createTweetStructure() {
    // Connect to MongoDB
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db(dbName);
    
    // Get all tweets from MongoDB
    const tweets = await db.collection(collectionName).find().toArray();
    
    // Organize tweets by screen_name and create tweet information hash
    const userTweetLists = {}; // Object to store lists of tweet IDs for each user
    const tweetInfoHash = {}; // Hash to store tweet information by tweet ID
    
    for (const tweet of tweets) {
        const { _id, user: { screen_name }, ...tweetInfo } = tweet;
        
        // Add tweet ID to user's tweet list
        if (!userTweetLists[screen_name]) {
            userTweetLists[screen_name] = [];
        }
        userTweetLists[screen_name].push(_id.toString());
        
        // Add tweet information to tweetInfoHash
        tweetInfoHash[`tweet:${_id}`] = JSON.stringify(tweetInfo);
    }
    
    // Add user tweet lists to Redis
    for (const [screen_name, tweetIDs] of Object.entries(userTweetLists)) {
        await redisClient.lpush(`tweets:${screen_name}`, ...tweetIDs);
    }
    
    // Add tweet information hash to Redis
    for (const [tweetID, tweetInfo] of Object.entries(tweetInfoHash)) {
        await redisClient.hmset(tweetID, JSON.parse(tweetInfo));
    }
    
    client.close();
}

createTweetStructure();
