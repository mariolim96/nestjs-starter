import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DATABASE } from './database.module';
import * as schema from './schema';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(DATABASE)
    public readonly db: PostgresJsDatabase<typeof schema>,
  ) {}
}
