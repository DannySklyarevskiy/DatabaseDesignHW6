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

async function countFavorites() {
    // Connect to MongoDB
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db(dbName);
    
    // Query MongoDB to get the total number of tweets
    const totalTweets = await db.collection(collectionName).estimatedDocumentCount();

    // Initialize favoritesSum to 0
    redisClient.set('favoritesSum', 0);

    for (let i = 0; i < totalTweets; i++) {
        const tweet = await db.collection(collectionName).findOne({}, { skip: i });
        const favorite_count = tweet.favorite_count;
        // Increase favoritesSum for each document
        redisClient.incrby('favoritesSum', favorite_count);
    }
    
    // Get the final favorite count
    let favoritesSum = await redisClient.get('favoritesSum');
    
    // Print the favorite count to the console
    console.log(`There were ${favoritesSum} total favorites`);
    
    client.close();
}

countFavorites();
