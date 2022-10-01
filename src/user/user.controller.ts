import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

ApiTags('USER DATA');
@Controller('user')
export class UserController {
  @Get('all-users')
  findAll() {
    return 'this will return list of all users';
  }
}
