import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  getHello(): string {
    const node: string | undefined = this.configService.get('enviroment');
    console.log(node);
    return 'hello world!';
  }
}
