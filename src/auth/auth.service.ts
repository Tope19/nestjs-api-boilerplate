import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { ApiResponse } from '../common/helpers/response';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { Ok } from '../common/helpers/response';
import { JwtHelperService } from './jwtHelper.service';
import { ConfigService } from '@nestjs/config';
import { PasswordResetDto } from '../user/dto/password-reset.dto';
import { randomBytes, pbkdf2Sync } from 'crypto';
import { MailService } from '../mail/mail.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { configConstant } from '../common/constants/config.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerificationService } from '../email-verification/email-verification.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtTokenService: JwtService,
    private jwtHelperService: JwtHelperService,
    private readonly configService: ConfigService,
    private mailService: MailService,
    private httpService: HttpService,
    private emailVerificationService: EmailVerificationService,
  ) {}

  async signup(user: CreateUserDto) {
    const userdata = Object.assign(new User(), user);
    const newUser = await this.usersRepo.save(userdata).catch((e) => {
      throw new BadRequestException(
        ApiResponse.BadRequest('Duplicate Values', 'The Email already exists'),
      );
    });

    //send a verification link to the user
    await this.emailVerificationService.sendVerificationLink(newUser.email);

    return newUser;
  }

  async signin(
    dto: SignInDto,
    values: { userAgent: string; ipAddress: string },
  ) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user)
      throw ApiResponse.BadRequest('Not found', 'Invalid Credentials!');
    if (user.isEmailVerified) {
      const hash = await this.jwtHelperService.hashPassword(
        dto.password,
        user.password.split(':')[0],
      );
      const isPasswordCorrect = hash == user.password;
      if (!isPasswordCorrect)
        throw ApiResponse.BadRequest('Access Denied!', 'Incorrect Credentials');
      const tokens = await this.getNewRefreshAndAccessTokens(values, user);
      return ApiResponse.Ok<object>(
        {
          ...tokens,
          userId: user.id,
          profileId: user.profileID,
          email: user.email,
          fullName: user.fullName,
        },
        'Successfully logged in',
        201,
      );
    } else {
      throw new BadRequestException(
        ApiResponse.BadRequest(
          'Access Denied',
          'Please verify your email before logging in',
          '401',
        ),
      );
    }
  }

  async signout(refreshToken: string) {
    const check = await this.usersRepo.findOne({
      where: { refreshToken: refreshToken },
    });
    if (!check)
      throw new BadRequestException(
        ApiResponse.BadRequest(
          'Invalid Refresh Token',
          'Get the correct refresh token and try again',
        ),
      );

    await this.usersRepo.update(
      { refreshToken: refreshToken },
      { refreshToken: null },
    );
    return ApiResponse.Ok('', 'Successfully logged out', 201);
  }

  async getNewTokens(refreshToken: string) {
    return await this.jwtHelperService.getNewTokens(refreshToken);
  }

  async getNewRefreshAndAccessTokens(
    values: { userAgent: string; ipAddress: string },
    user,
  ) {
    const refreshobject = {
      userAgent: values.userAgent,
      ipAddress: values.ipAddress,
      id: user.id,
    };

    return {
      access: await this.jwtHelperService.signAccess(refreshobject),
      refresh: await this.jwtHelperService.signRefresh(refreshobject),
    };
  }

  async forgotPassword(email: string): Promise<string> {
    const user: User = await this.usersRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(
        ApiResponse.NotFoundRequest(
          'Not found',
          'email does not exist on the server',
          '404',
        ),
      );
    }
    const payload = {
      id: user.id,
      email: user.email,
    };
    const currentPassword = user.password;
    const resetToken = await this.jwtHelperService.forgotPassword(
      payload,
      currentPassword,
    );

    //url paths
    const baseUrl = this.configService.get(configConstant.baseUrl.identityUrl);
    const notifyUrl = this.configService.get(configConstant.baseUrl.nofication);
    const resetEndpoint = `${baseUrl}/Auth-Users/AuthController_resetPassword/${resetToken}`;
    const frontEndBase = this.configService.get(
      configConstant.baseUrl.identityUrlFE,
    );
    const resetPage = `${frontEndBase}/password-reset`;
    const emailUrlPath = `${notifyUrl}/email/send-mail`;

    const emailLink = {
      email: user.email,
      subject: 'Password Reset Request',
      text: `Kindly click the link below to proceed with the password reset 
            \n ${resetPage}`,
    };
    const p = this.httpService.axiosRef;
    // This sends the reset link to the registered email of the user
    const axiosRes = await p({
      method: 'post',
      url: emailUrlPath,
      data: emailLink,
    });
    return resetEndpoint;
  }

  async resetPassword(
    id: string,
    token: string,
    body: PasswordResetDto,
  ): Promise<User> {
    const user: User = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(
        ApiResponse.NotFoundRequest('User does not exist on the server'),
      );
    }
    await this.jwtHelperService.verifyResetToken(token, user.password);
    const salt = randomBytes(32).toString('hex');
    const hash = pbkdf2Sync(body.password, salt, 1000, 64, 'sha512').toString(
      'hex',
    );
    const hashedPassword = `${salt}:${hash}`;
    await this.usersRepo.update(id, { password: hashedPassword });
    return user;
  }
}
