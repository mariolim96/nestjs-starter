import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  //   const databaseService: DatabaseService;

  const mockDatabaseService = {
    db: {
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    // databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'password123',
      };

      const mockUser = {
        id: 1,
        ...userData,
        passwordHash: 'hashedPassword',
      };

      mockDatabaseService.db.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      mockDatabaseService.db.insert.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockUser]),
        }),
      });

      const result = await service.create(userData);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
      };

      mockDatabaseService.db.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockUser]),
          }),
        }),
      });

      const result = await service.findById(userId);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 1;

      mockDatabaseService.db.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      await expect(service.findById(userId)).rejects.toThrow(NotFoundException);
    });
  });

  it('should return true for matching passwords', async () => {
    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const result = await service.verifyPassword(plainPassword, hashedPassword);
    expect(result).toBe(true);
  });

  it('should return false for non-matching passwords', async () => {
    const plainPassword = 'password123';
    const wrongPassword = 'wrongpassword';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const result = await service.verifyPassword(wrongPassword, hashedPassword);
    expect(result).toBe(false);
  });
});
