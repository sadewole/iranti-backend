import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { LocalAuthDto } from './auth.dto';
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
    private usersRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async validateLogin(body: LocalAuthDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email: body.email });
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
      console.log('code', code);
      const user = await this.usersRepository.save({
        ...body,
        password: hashPassword,
      });
      await this.cacheManager.set(
        `${REDIS_KEYS.VERIFY_EMAIL_TOKEN}:${1}`,
        code,
        expiryMin,
      );

      return this.signedUserToken(user);
    } catch (error) {
      this.logger.error(error);
      throw new ConflictException('User already exists');
    }
  }

  signedUserToken(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      isVerified: user.isVerified,
    };
  }
}
