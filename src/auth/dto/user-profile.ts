import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserProfileDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}
