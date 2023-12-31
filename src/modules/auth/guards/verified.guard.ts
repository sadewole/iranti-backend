import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class VerifiedUserGuard {
  constructor() {}

  canActivate(context: ExecutionContext) {
    const { user } = context.switchToHttp().getRequest();
    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Unauthorized access!. Please, verify your account.',
      );
    }
    return true;
  }
}
