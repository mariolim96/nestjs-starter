import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'User username',
    example: 'john_doe_updated',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username?: string;

  @ApiPropertyOptional({
    description: 'User email address',
    example: 'john.updated@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'User password',
    example: 'newSecurePassword123',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
