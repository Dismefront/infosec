import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  login: string;
  sub: number;
}

interface AuthenticatedUser {
  userId: number;
  login: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'my-secret-key',
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return { userId: payload.sub, login: payload.login };
  }
}
