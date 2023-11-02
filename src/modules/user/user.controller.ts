import { Body, Controller, Post, Put } from '@nestjs/common';
import { ResendCodeDto } from '../auth/auth.dto';
import { UserService } from './user.service';
import { ResetPasswordDto } from './user.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('forgot_password')
  @ApiOperation({ summary: 'Send code to reset password' })
  async forgotPassword(@Body() body: ResendCodeDto) {
    return await this.userService.forgotPassword(body);
  }

  @Put('reset_password')
  @ApiOperation({ summary: 'Reset user password' })
  async resetPassword(@Body() body: ResetPasswordDto) {
    return await this.userService.resetPassword(body);
  }
}
