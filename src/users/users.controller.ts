import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const userData = {
      username: createUserDto.username,
      email: createUserDto.email,
      passwordHash: createUserDto.password,
    };

    const user = await this.usersService.create(userData);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserResponseDto],
  })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
    }));
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total number of users' })
  @ApiResponse({
    status: 200,
    description: 'Total number of users',
    schema: { type: 'object', properties: { count: { type: 'number' } } },
  })
  async getCount(): Promise<{ count: number }> {
    const count = await this.usersService.count();
    return { count };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiParam({ name: 'email', description: 'User email', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByEmail(@Param('email') email: string): Promise<UserResponseDto> {
    const user = await this.usersService.findByEmail(email);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Get user by username' })
  @ApiParam({ name: 'username', description: 'Username', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByUsername(
    @Param('username') username: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findByUsername(username);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email or username already exists' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const updateData: Partial<{
      username: string;
      email: string;
      passwordHash: string;
    }> = {};

    if (updateUserDto.username) updateData.username = updateUserDto.username;
    if (updateUserDto.email) updateData.email = updateUserDto.email;
    if (updateUserDto.password)
      updateData.passwordHash = updateUserDto.password;

    const user = await this.usersService.update(id, updateData);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.delete(id);
  }

  @Get(':id/exists')
  @ApiOperation({ summary: 'Check if user exists by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'User existence status',
    schema: { type: 'object', properties: { exists: { type: 'boolean' } } },
  })
  async checkExists(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ exists: boolean }> {
    const exists = await this.usersService.exists(id);
    return { exists };
  }
}
