import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  users,
  User,
  NewUser,
  insertUserSchema,
} from '../database/schema/users.schema';
import { eq, or } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userData: NewUser): Promise<User> {
    const validatedData = insertUserSchema.parse(userData);

    const existingUser = await this.databaseService.db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, validatedData.email),
          eq(users.username, validatedData.username),
        ),
      )
      .limit(1);

    if (existingUser.length > 0) {
      const existing = existingUser[0];
      if (existing && existing.email === validatedData.email) {
        throw new ConflictException('User with this email already exists');
      }
      if (existing && existing.username === validatedData.username) {
        throw new ConflictException('User with this username already exists');
      }
    }

    let hashedPassword = validatedData.passwordHash;
    if (validatedData.passwordHash) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(
        validatedData.passwordHash,
        saltRounds,
      );
    }

    const [newUser] = await this.databaseService.db
      .insert(users)
      .values({
        ...validatedData,
        passwordHash: hashedPassword,
      })
      .returning();

    if (!newUser) {
      throw new Error('Failed to create user');
    }

    return newUser;
  }

  async findAll(): Promise<User[]> {
    return await this.databaseService.db.select().from(users);
  }

  async findById(id: number): Promise<User> {
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async findByEmailOrUsername(identifier: string): Promise<User | null> {
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(or(eq(users.email, identifier), eq(users.username, identifier)))
      .limit(1);

    return user || null;
  }

  async update(id: number, updateData: Partial<NewUser>): Promise<User> {
    await this.findById(id);

    if (updateData.email || updateData.username) {
      const conflictCheck = await this.databaseService.db
        .select()
        .from(users)
        .where(
          or(
            updateData.email ? eq(users.email, updateData.email) : undefined,
            updateData.username
              ? eq(users.username, updateData.username)
              : undefined,
          ),
        )
        .limit(1);

      if (conflictCheck.length > 0) {
        const conflictUser = conflictCheck[0];
        if (conflictUser && conflictUser.id !== id) {
          if (conflictUser.email === updateData.email) {
            throw new ConflictException('User with this email already exists');
          }
          if (conflictUser.username === updateData.username) {
            throw new ConflictException(
              'User with this username already exists',
            );
          }
        }
      }
    }

    const dataToUpdate = { ...updateData };
    if (updateData.passwordHash) {
      const saltRounds = 10;
      dataToUpdate.passwordHash = await bcrypt.hash(
        updateData.passwordHash,
        saltRounds,
      );
    }

    const [updatedUser] = await this.databaseService.db
      .update(users)
      .set(dataToUpdate)
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.databaseService.db.delete(users).where(eq(users.id, id));
  }

  async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async count(): Promise<number> {
    const result = await this.databaseService.db.select().from(users);
    return result.length;
  }

  async exists(id: number): Promise<boolean> {
    try {
      await this.findById(id);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return false;
      }
      throw error;
    }
  }
}
