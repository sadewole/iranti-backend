import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ResendCodeDto } from '../auth/auth.dto';
import { UserService } from './user.service';
import { ResetPasswordDto } from './user.dto';
import { JwtAuthGuard, RolesGuard, VerifiedUserGuard } from '../auth/guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, VerifiedUserGuard, RolesGuard)
  @Roles(Role.Admin)
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

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
