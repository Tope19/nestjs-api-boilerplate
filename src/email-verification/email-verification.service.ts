import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { configConstant } from 'src/common/constants/config.constant';
import { ApiResponse } from 'src/common/helpers/response';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { VerifyToken } from './verify.interface';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  /*
   * sendVerificationLink - send verification token to a newly registered user
   * @Params: email - email created by the user
   * return - return a http request to send email notification
   */
  async sendVerificationLink(email: string) {
    const payload: VerifyToken = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    const url = `${this.configService.get(
      configConstant.baseUrl.identityUrl,
    )}/email-verification/${token}`;
    const text = `Welcome. To confirm your mail, please click the link: ${url}`;

    // A called to axios to send maill notification
    const sendNotification = await this.httpService.post(
      `${this.configService.get<string>(
        configConstant.baseUrl.nofication,
      )}/email/send-mail`,
      {
        email: email,
        subject: 'Confirm Email',
        text: text,
      },
    );
    return await lastValueFrom(sendNotification.pipe());
  }

  /*
   * decodeEmailToken - verify if the verification token is authentic and makes
   *                    user email as verified
   * @Params: token - token sent to the user
   * return - return a called function(createUserProfile) to create user profile
   */
  async decodeEmailToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });
      // Mark User email as verified
      await this.markEmailAsConfirmed(payload.email);
      // console.log(payload.email);

      //Create a user profile once email is verified
      return await this.createUserProfile(payload.email);
    } catch (error) {
      if (error?.name === 'TokenExpiredError')
        throw new BadRequestException(
          ApiResponse.BadRequest(
            'Unathorized',
            'Email confirmation token expired',
            '401',
          ),
        );

      // throw error if user profile cant be created
      throw new BadRequestException(
        ApiResponse.BadRequest('Internal Server Error', error.message),
      );
    }
  }

  /*
   * resendVerificationLink - resend verification if a user email is unverified
   * @Params: email - find user by email property
   */
  async resendVerificationLink(email: string) {
    const user = await this.usersRepo.findOne({
      where: {
        email,
      },
    });
    if (!user.isEmailVerified) {
      this.sendVerificationLink(email);
    }
  }

  /*
   * marEmailAsConfirmed - sets a registered user email to be verified
   * @Params: email - find user by email property
   * return - the updated mail status
   */
  async markEmailAsConfirmed(email: string) {
    const user = await this.usersRepo.findOne({
      where: {
        email,
      },
    });
    user.isEmailVerified = true;
    return await this.usersRepo.save(user);
  }

  /*
   * createUserProfile - Find a user by email and creates a profile for the
   *                     when called upon at the time of email verification
   * @Params: email - email created by the user
   * return - return a http request to send email notification
   */
  async createUserProfile(email: string) {
    const newUser = await this.usersRepo.findOne({
      where: {
        email,
      },
    });
    // console.log(newUser);
    if (newUser) {
      // TODO: send POST request to the profile service to create the profile
      // Axios
      const new_Profile = await this.httpService.post(
        `${this.configService.get<string>(
          configConstant.profileUrl.baseUrl,
        )}/profile/create`,
        {
          user_id: newUser.id,
          email: newUser.email,
        },
      );

      const newProfile = await lastValueFrom(new_Profile.pipe());
      const profileData = newProfile.data;
      newUser.profileID = profileData.id;

      const new_User = await this.usersRepo.save(newUser);
      return new_User;
    }
  }
}
