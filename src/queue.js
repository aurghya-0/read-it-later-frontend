import Queue from "bull";
import redisConfig from "./redisConfig.js"; // your Redis configuration

const articleQueue = new Queue("articleQueue", redisConfig);

export default articleQueue;
