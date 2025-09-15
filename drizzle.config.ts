import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    user: process.env.DATABASE_USER || 'nestjs_user',
    password: process.env.DATABASE_PASSWORD || 'nestjs_password',
    database: process.env.DATABASE_NAME || 'nestjs_chat',
    ssl: false,
  },
  verbose: true,
  strict: true,
});
