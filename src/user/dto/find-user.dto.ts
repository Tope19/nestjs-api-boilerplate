import { ApiProperty } from '@nestjs/swagger'
import {IsEmail} from 'class-validator'
export class FindUserDto {
    @IsEmail()
    @ApiProperty()
    email: string
}