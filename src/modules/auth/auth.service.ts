import { Injectable } from '@nestjs/common';
import { LocalAuthDto } from './auth.dto';

@Injectable()
export class AuthService {
  login(body: LocalAuthDto) {
    return body.email;
  }

  register(body: LocalAuthDto) {
    return body.email;
  }
}
