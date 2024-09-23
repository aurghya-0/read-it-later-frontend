import Queue from "bull";
import redisConfig from "./redisConfig.js";

const articleQueue = new Queue("articleQueue", redisConfig);

export default articleQueue;
