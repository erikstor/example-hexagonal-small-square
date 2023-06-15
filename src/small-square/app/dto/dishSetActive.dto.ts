import {IsBoolean, IsNotEmpty, IsNumber} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";


export class DishSetActiveDto {

    @ApiProperty({
        example: true,
        description: 'Debe ser un boleano',
        required: true
    })
    @IsNotEmpty({message: 'El campo activo es requerido'})
    @IsBoolean({message: 'El campo activo debe ser un boleano'})
    activo: boolean

    @ApiProperty({
        example: 1,
        description: 'Debe ser un numero',
        required: true
    })
    @IsNotEmpty({message: 'El campo restaurante es requerido'})
    @IsNumber({}, {message: 'El campo restaurante debe ser un numero'})
    restaurante: number

}