import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://localhost:6379', // Default Redis URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Redis connection error:', error);
  }
};

export { redisClient, connectRedis };
