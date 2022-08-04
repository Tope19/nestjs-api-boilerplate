import { ApiProperty } from '@nestjs/swagger'
import {IsEmail, IsString, MinLength, Matches, MaxLength, IsNotEmpty} from 'class-validator'
export class CreateUserDto {
    @IsString()
    @IsNotEmpty({message: 'fullname cannot be empty'})
    @ApiProperty()
    fullName: string

    @IsEmail()
    @IsString()
    @ApiProperty()
    email: string

    @IsString()
    @IsNotEmpty({message: 'password cannot be empty'})
    @ApiProperty()
    @MinLength(8, 
        {message: 'Password is too short. Minimal length is $constraint1 characters, but actual is $value'}
    )
    @MaxLength(20, 
        { message: 'password is too long. Maximal length is $constraint1 characters, but actual is $value'}
    )
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
        {message: 'password must contain the following: a capital letter, a number and a special character'}
    )
    password: string
}