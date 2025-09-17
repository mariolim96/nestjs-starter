import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    exists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
      };

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(mockUsersService.create).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'password123',
      });
      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          id: 1,
          username: 'user1',
          email: 'user1@example.com',
          passwordHash: 'hash1',
        },
        {
          id: 2,
          username: 'user2',
          email: 'user2@example.com',
          passwordHash: 'hash2',
        },
      ];

      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(mockUsersService.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { id: 1, username: 'user1', email: 'user1@example.com' },
        { id: 2, username: 'user2', email: 'user2@example.com' },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
      };

      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.findOne(1);

      expect(mockUsersService.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'updateduser',
        email: 'updated@example.com',
      };

      const mockUpdatedUser = {
        id: 1,
        username: 'updateduser',
        email: 'updated@example.com',
        passwordHash: 'hashedPassword',
      };

      mockUsersService.update.mockResolvedValue(mockUpdatedUser);

      const result = await controller.update(1, updateUserDto);

      expect(mockUsersService.update).toHaveBeenCalledWith(1, {
        username: 'updateduser',
        email: 'updated@example.com',
      });
      expect(result).toEqual({
        id: 1,
        username: 'updateduser',
        email: 'updated@example.com',
      });
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockUsersService.delete.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockUsersService.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('getCount', () => {
    it('should return user count', async () => {
      mockUsersService.count.mockResolvedValue(5);

      const result = await controller.getCount();

      expect(mockUsersService.count).toHaveBeenCalled();
      expect(result).toEqual({ count: 5 });
    });
  });

  describe('checkExists', () => {
    it('should return true if user exists', async () => {
      mockUsersService.exists.mockResolvedValue(true);

      const result = await controller.checkExists(1);

      expect(mockUsersService.exists).toHaveBeenCalledWith(1);
      expect(result).toEqual({ exists: true });
    });

    it('should return false if user does not exist', async () => {
      mockUsersService.exists.mockResolvedValue(false);

      const result = await controller.checkExists(999);

      expect(mockUsersService.exists).toHaveBeenCalledWith(999);
      expect(result).toEqual({ exists: false });
    });
  });
});
