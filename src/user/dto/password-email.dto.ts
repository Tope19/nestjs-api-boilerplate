import { IsString, IsNotEmpty} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class PasswordForgotEmailDto {
    @IsString()
    @IsNotEmpty({message: 'enter email used for this account'})
    @ApiProperty()
    email: string
}
