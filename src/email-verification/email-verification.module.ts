import { forwardRef, Module } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { EmailVerificationController } from './email-verification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { JwtHelperService } from '../auth/jwtHelper.service';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({ publicKey: 'PUBLIC_KEY', privateKey: 'PRIVATE_KEY' }),
    HttpModule,
    ConfigModule,
  ],
  providers: [
    EmailVerificationService,
    UserService,
    JwtHelperService,
    AuthService,
    MailService,
  ],
  controllers: [EmailVerificationController],
  exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
