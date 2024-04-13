Used Codeium (VSCode AI assistant) to help with writing comments

Used ChatGPT to help generate the base docuent (which I heavily edited)<br>
**Inputted prompt:**<br> Generate base js code that allows for connecting to Mongo and Redis <br>
**Generated response:**<br>
```const MongoClient = require('mongodb').MongoClient;
const Redis = require('ioredis');

// Connection URLs for MongoDB and Redis
const mongoUrl = 'mongodb://localhost:27017';
const redisUrl = 'redis://localhost:6379';

// Database and collection names for MongoDB
const dbName = 'your_database_name';
const collectionName = 'your_collection_name';

// Initialize Redis client
const redisClient = new Redis(redisUrl);

// Function to connect to MongoDB
async function connectToMongo() {
    try {
        const client = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
        console.log('Connected to MongoDB');
        return client.db(dbName);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// Function to connect to Redis
async function connectToRedis() {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
        return redisClient;
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
}

// Example usage:
async function main() {
    const db = await connectToMongo();
    const redis = await connectToRedis();

    // Use db and redis connections here
    // For example, you can perform database queries or set/get values in Redis
}

main();
```
The code was heavily altered in the final queries