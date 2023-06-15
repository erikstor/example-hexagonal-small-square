import {IsNotEmpty, IsNumber, Min} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";


export class AssignOrder {

    @ApiProperty({
        example: 1,
        description: 'Debe ser un numero mayor o igual a 1',
        required: true
    })
    @IsNotEmpty({message: 'El campo orden es requerido'})
    @IsNumber({}, {message: 'El campo orden debe ser un numero entero positivo'})
    @Min(1, {message: 'El campo orden debe ser un numero entero positivo'})
    order: number


    @ApiProperty({
        example: 1,
        description: 'Debe ser un numero mayor o igual a 1',
        required: true
    })
    @IsNotEmpty({message: 'El campo chef es requerido'})
    @IsNumber({}, {message: 'El campo chef debe ser un numero entero positivo'})
    @Min(1, {message: 'El campo chef debe ser un numero entero positivo'})
    chef: number


    @ApiProperty({
        example: 1,
        description: 'Debe ser un numero mayor o igual a 1',
        required: true
    })
    @IsNotEmpty({message: 'El campo restaurante es requerido'})
    @IsNumber({}, {message: 'El campo restaurante debe ser un numero entero positivo'})
    @Min(1, {message: 'El campo restaurante debe ser un numero entero positivo'})
    restaurant: number


}