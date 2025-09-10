import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return 'This endpoint adds a new user';
  }
}
