import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Next,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../common/constants/jwt.constant';
import { ApiResponse } from '../common/helpers/response';
import { randomBytes, pbkdf2Sync } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtHelperService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwTokenService: JwtService,
    private configService: ConfigService,
  ) {}

  async signAccess(payload: {
    userAgent: string;
    ipAddress: string;
    id: string;
  }) {
    return this.jwTokenService.sign(payload, {
      secret: await this.configService.get(jwtConstants.access_secret),
      expiresIn: await this.configService.get(jwtConstants.access_time),
    });
  }

  async signRefresh(payload: {
    userAgent: string;
    ipAddress: string;
    id: string;
  }) {
    const refreshToken = this.jwTokenService.sign(payload, {
      secret: await this.configService.get(jwtConstants.refresh_secret),
      expiresIn: await this.configService.get(jwtConstants.refresh_time),
    });

    const user = await this.userRepo.findOne({ where: { id: payload.id } });
    await this.userRepo.update(user.id, { refreshToken }).catch((err) => {
      throw new BadRequestException(
        ApiResponse.BadRequest('user not found', 'This user does not exist'),
      );
    });
    return refreshToken;
  }

  async getNewTokens(refreshToken: string) {
    try {
      let payload = this.jwTokenService.verify(refreshToken, {
        secret: await this.configService.get(jwtConstants.refresh_secret),
      });
      payload = {
        id: payload.id,
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
      };

      const verified = await this.userRepo.findOne({
        where: {
          refreshToken: refreshToken,
        },
      });
      if (verified) {
        return {
          access: await this.signAccess(payload),
        };
      } else throw new Error();
    } catch (error) {
      throw new BadRequestException(
        ApiResponse.BadRequest(
          'Invalid Refresh Token',
          'Get the correct refresh token and try again',
        ),
      );
    }
  }

  async forgotPassword(
    payload: { id: string; email: string },
    password: string,
  ) {
    const secretCombo =
      (await this.configService.get(jwtConstants.reset_secret)) + password;
    return this.jwTokenService.sign(payload, {
      secret: secretCombo,
      expiresIn: await this.configService.get(jwtConstants.reset_time),
    });
  }

  async verifyResetToken(token: string, password: string) {
    const secretCombo =
      (await this.configService.get(jwtConstants.reset_secret)) + password;
    try {
      const payload = await this.jwTokenService.verify(token, {
        secret: secretCombo,
      });
      return payload;
    } catch (error) {
      throw new ForbiddenException(
        ApiResponse.BadRequest(error.name, error.message, error.status),
      );
    }
  }

  async hashPassword(password: string, salt?: string) {
    if (!salt) salt = randomBytes(32).toString('hex');
    const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    const hashedPassword = `${salt}:${hash}`;
    return hashedPassword;
  }
}
