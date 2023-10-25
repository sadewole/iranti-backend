import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { LocalAuthDto } from './auth.dto';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { generateExpiryCode } from 'src/common/utils';

@Injectable()
export class AuthService {
  constructor(
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
    return await this.generateToken(user);
  }

  async register(body: LocalAuthDto) {
    try {
      const hashPassword = await this.passwordService.hashPassword(
        body.password,
      );

      const { code } = generateExpiryCode();

      console.log('code', code);

      const user = await this.usersRepository.save({
        ...body,
        password: hashPassword,
      });

      delete user.password;
      return this.generateToken(user);
    } catch (error) {
      this.logger.error(error);
      throw new ConflictException('User already exists');
    }
  }

  async generateToken(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
