import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyToken {
  @IsString()
  @IsNotEmpty()
  email: string;
}
