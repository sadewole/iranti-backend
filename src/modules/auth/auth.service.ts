import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LocalAuthDto, ResendCodeDto, VerifyEmailDto } from './auth.dto';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { REDIS_KEYS, generateExpiryCode } from 'src/common/helpers';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async validateLogin(body: LocalAuthDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: body.email });
    if (!user) {
      throw new ForbiddenException('Invalid crendentials');
    }

    const isMatch = await this.passwordService.comparePassword(
      body.password,
      user.password,
    );
    if (!isMatch) {
      throw new ForbiddenException('Invalid crendentials');
    }

    delete user.password;
    return user;
  }

  async login({ user }: { user: User }) {
    return this.signedUserToken(user);
  }

  async register(body: LocalAuthDto) {
    try {
      const hashPassword = await this.passwordService.hashPassword(
        body.password,
      );
      const { code, expiryMin } = generateExpiryCode();

      const user = await this.userRepository.save({
        ...body,
        password: hashPassword,
      });
      await this.cacheManager.set(
        `${REDIS_KEYS.VERIFY_EMAIL_TOKEN}:${user.id}`,
        code,
        expiryMin,
      );

      return this.signedUserToken(user);
    } catch (error) {
      this.logger.error(error);
      throw new ConflictException('User already exists');
    }
  }

  async resendVerifyCode(body: ResendCodeDto) {
    const user = await this.userRepository.findOneBy({ email: body.email });
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    if (user.isVerified) {
      throw new UnauthorizedException('Email already verified');
    }

    const { code, expiryMin } = generateExpiryCode();

    await this.cacheManager.set(
      `${REDIS_KEYS.VERIFY_EMAIL_TOKEN}:${user.id}`,
      code,
      expiryMin,
    );

    // TODO: Create a EMAIL notification
    return { message: 'Verification code sent to email' };
  }

  async verifyEmail(body: VerifyEmailDto) {
    const user = await this.userRepository.findOneBy({ email: body.email });
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    if (user.isVerified) {
      throw new UnauthorizedException('Email already verified');
    }

    const getCode = await this.cacheManager.get(
      `${REDIS_KEYS.VERIFY_EMAIL_TOKEN}:${user.id}`,
    );

    if (getCode !== body.code) {
      throw new UnauthorizedException('Invalid verification code');
    }

    const updateUser = await this.userRepository.save({
      ...user,
      isVerified: true,
      password: undefined,
    });

    await this.cacheManager.del(`${REDIS_KEYS.VERIFY_EMAIL_TOKEN}:${user.id}`);

    return updateUser;
  }

  signedUserToken(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      isVerified: user.isVerified,
    };
  }
}
