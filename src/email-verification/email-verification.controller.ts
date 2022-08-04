import { Controller, Param, Get } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { EmailTokenDto } from './dto/email-token.dto';
import { ApiResponse } from 'src/common/helpers/response';

@Controller('email-verification')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificatioService: EmailVerificationService,
  ) {}

  @Get('/:token')
  async verifyEmail(@Param() emailTokenDto: EmailTokenDto) {
    const user = await this.emailVerificatioService.decodeEmailToken(
      emailTokenDto.token,
    );
    return ApiResponse.Ok<object>({ user }, 'Profile created', 201);
  }
}
