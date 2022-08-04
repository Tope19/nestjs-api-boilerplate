import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmailTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token: string;
}
