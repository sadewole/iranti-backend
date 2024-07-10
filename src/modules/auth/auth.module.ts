import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { PasswordService } from './password.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { JwtStrategy } from './strategies';
import { NotificationModule } from '../notification/notification.module';

const jwtFactory = {
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('jwt_secret'),
    signOptions: {
      expiresIn: 3600,
    },
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync(jwtFactory),
    TypeOrmModule.forFeature([User]),
    NotificationModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, UserService, JwtStrategy],
  exports: [AuthService, PasswordService],
})
export class AuthModule {}
