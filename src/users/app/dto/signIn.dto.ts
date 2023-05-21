import {IsNotEmpty, IsString, MinLength} from "class-validator";


export class SignInDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    password: string

}