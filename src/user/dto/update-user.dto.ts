import { IsEmail, IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @ApiProperty()
    fullName: string


    @IsEmail()
    @IsOptional()
    @ApiProperty()
    email: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    password: string


}