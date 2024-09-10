// src/queue.js
import Queue from 'bull';
import redisConfig from './redisConfig.js'; // your Redis configuration

// Create a queue for adding articles
const articleQueue = new Queue('articleQueue', redisConfig);

export default articleQueue;
