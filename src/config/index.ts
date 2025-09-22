export default () => ({
  environment: process.env.NODE_ENV || 'development',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379') || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL ?? '300') || 300, // 5 minutes default
    max: parseInt(process.env.CACHE_MAX_ITEMS ?? '100') || 100,
  },
});
