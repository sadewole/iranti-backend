import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LocalAuthDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LocalAuthDto) {
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() body: LocalAuthDto) {
    return this.authService.register(body);
  }
}
