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

    const isMatch = this.passwordService.comparePassword(
      body.password,
      user.password,
    );
    if (!isMatch) {
      throw new ForbiddenException('Invalid crendentials');
    }

    delete user.password;
    return user;
  }

  login({ user }: { user: User }) {
    return user.email;
  }

  async register(body: LocalAuthDto) {
    try {
      const hashPassword = await this.passwordService.hashPassword(
        body.password,
      );

      const user = await this.usersRepository.save({
        ...body,
        password: hashPassword,
      });

      delete user.password;
      return user.email;
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
