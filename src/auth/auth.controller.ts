import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeController } from '@nestjs/swagger';
import { AuthUser, UserRegister, UserSignIn } from './dto';
import { AuthService } from './service';
import { GetUser } from './decorator';

@Controller('auth')
@ApiExcludeController()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('user-register')
  async userRegister(@Body() body: UserRegister) {
    try {
      return await this.authService.userRegister(body);
    } catch (error) {
      throw error;
    }
  }

  @Post('user-signin')
  async userSignIn(@Body() body: UserSignIn) {
    try {
      return await this.authService.userSignIn(body);
    } catch (error) {
      throw error;
    }
  }

  @Get('whoami')
  @UseGuards(AuthGuard())
  async currentUser(@GetUser() user: AuthUser) {
    return user;
  }
}
