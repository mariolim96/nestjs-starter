import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Username', example: 'john_doe' })
  username: string;

  @ApiProperty({ description: 'Email address', example: 'john@example.com' })
  email: string;
}
