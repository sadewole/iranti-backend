import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { ResendCodeDto } from '../auth/auth.dto';
import { REDIS_KEYS, generateExpiryCode } from 'src/common/helpers';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ResetPasswordDto } from './user.dto';
import { PasswordService } from '../auth/password.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  async forgotPassword(body: ResendCodeDto) {
    const user = await this.userRepository.findOneBy({ email: body.email });
    const message = 'Password reset will be sent to email if valid';
    if (!user) {
      return { message };
    }

    const { code, expiryMin } = generateExpiryCode();

    await this.cacheManager.set(
      `${REDIS_KEYS.FORGOT_PASSWORD_TOKEN}:${user.id}`,
      code,
      expiryMin,
    );

    // TODO: Create a EMAIL notification
    return { message };
  }

  async resetPassword(body: ResetPasswordDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: body.email });
    if (!user) {
      throw new UnauthorizedException('Invalid email address');
    }

    const getCode = await this.cacheManager.get(
      `${REDIS_KEYS.FORGOT_PASSWORD_TOKEN}:${user.id}`,
    );

    if (getCode !== body.code) {
      throw new UnauthorizedException('Invalid verification code');
    }

    const hashPassword = await this.passwordService.hashPassword(body.password);
    user.password = hashPassword;
    await this.userRepository.save(user);

    await this.cacheManager.del(
      `${REDIS_KEYS.FORGOT_PASSWORD_TOKEN}:${user.id}`,
    );

    delete user.password;
    return user;
  }

  async findUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        isVerified: true,
        createdAt: true,
      },
    });
  }
}
