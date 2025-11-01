import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(user: User): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
