import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalAuthDto, IsEmailDto, VerifyEmailDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards';

@ApiTags('auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    return req.user;
  }

  @Post('login')
  async login(@Body() body: LocalAuthDto) {
    const user = await this.authService.validateLogin(body);
    return this.authService.login({ user });
  }

  @Post('register')
  async register(@Body() body: LocalAuthDto) {
    return await this.authService.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify_email')
  async verifyEmail(@Body() body: VerifyEmailDto) {
    return await this.authService.verifyEmail(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('resend_code')
  async resendVerifyCode(@Body() body: IsEmailDto) {
    return await this.authService.resendVerifyCode(body);
  }
}
