import {IsEmail, IsNotEmpty, IsNumber, IsString, Min, MinLength, Validate} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {
    RegisterEmployeePhoneFieldValidator,
    RegisterEmployeeTypeFieldValidator
} from "../../infra/validators/users.validator";


export class RegisterEmployeeDto {


    @ApiProperty({
        example: 'example@example.com',
        description: 'Debe ser una cadena de texto con formato email valido',
        required: true
    })
    @IsString()
    @IsNotEmpty({
        message: 'Debe ser una cadena de texto con formato email valido',
    })
    @IsEmail({}, {
        message: 'Debe ser una cadena de texto con formato email valido',
    })
    correo: string

    @ApiProperty({
        example: 'password',
        description: 'Debe ser una cadena de texto',
        required: true
    })
    @IsString({
        message: 'Debe ser una cadena de texto',
    })
    @IsNotEmpty({
        message: 'Debe ser una cadena de texto',
    })
    clave: string


    @ApiProperty({
        example: 'Pepito',
        description: 'El nombre es obligatorio, debe contener minimo tres letras',
        required: true
    })
    @IsString({
        message: 'El nombre es obligatorio, debe contener minimo tres letras'
    })
    @IsNotEmpty({
        message: 'El nombre es obligatorio, debe contener minimo tres letras'
    })
    @MinLength(3)
    nombre: string

    @ApiProperty({
        example: 'Perez',
        description: 'El apellido es obligatorio, debe contener minimo tres letras',
        required: true
    })
    @IsString({
        message: 'El apellido es obligatorio, debe contener minimo tres letras'
    })
    @IsNotEmpty({
        message: 'El apellido es obligatorio, debe contener minimo tres letras'
    })
    @MinLength(3)
    apellido: string

    @ApiProperty({
        example: 123456789,
        description: 'La identificacion es obligatoria, debe ser numerica',
        required: true
    })
    @IsNumber()
    @IsNotEmpty({
        message: 'La identificacion es obligatoria, debe ser numerica',
    })
    @Min(1)
    dni: number

    @ApiProperty({
        example: '+573153226431',
        description: 'El celular es obligatorio, debe contener maximo 13 caracteres, si es un celular debe agregar el "+"',
        required: true
    })
    @IsString()
    @IsNotEmpty({
        message: 'El celular es obligatorio, debe contener maximo 13 caracteres, si es un celular debe agregar el "+"'
    })
    @MinLength(13)
    @Validate(RegisterEmployeePhoneFieldValidator, {
        message: 'El celular es obligatorio, debe contener maximo 13 caracteres, si es un celular debe agregar el "+"'
    })
    celular: string

    @ApiProperty({
        example: 'employee',
        description: 'Debe ser una cadena de texto',
        required: true
    })
    @IsString()
    @IsNotEmpty({
        message: 'El tipo es obligatorio'
    })
    @Validate(RegisterEmployeeTypeFieldValidator, {
        message: 'El tipo es obligatorio'
    })
    tipo: string

    @ApiProperty({
        example: 1,
        description: 'La identificacion es obligatoria, debe ser numerica',
        required: true
    })
    @IsNumber()
    @IsNotEmpty({
        message: 'La identificacion del restaurante es obligatoria, debe ser numerica',
    })
    @Min(1)
    restaurante: number

}