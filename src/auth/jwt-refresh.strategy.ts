import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../infra/prisma/prisma.service';
import { UserRole } from 'prisma/generated/prisma';

export interface JwtRefreshPayload {
  sub: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtRefreshPayload) {
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();

    const user = await this.prisma.avaliador.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      refreshToken: user.refreshToken,
    };
  }
}
