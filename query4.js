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

async function createLeaderboard() {
    // Connect to MongoDB
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db(dbName);
    
    // Aggregate to count tweets by each user and sort by tweet count
    const pipeline = [
        { $group: { _id: '$user.screen_name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 } // Limit to top 10 users
    ];
    
    const topUsers = await db.collection(collectionName).aggregate(pipeline).toArray();
    
    // Prepare data for leaderboard
    const leaderboardData = topUsers.map(user => [user._id, user.count]);
    
    // Add top users to Redis sorted set
    await redisClient.zadd('leaderboard', ...leaderboardData);
    
    client.close();
}

createLeaderboard();
