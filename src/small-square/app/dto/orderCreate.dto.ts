import {ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsNumber, IsString, Min} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {OrderInterfaces} from "../interfaces/order.interfaces";


export class OrderCreateDto {

    @ApiProperty({
        example: '2023-01-01',
        description: 'Debe ser una fecha valida',
        required: true
    })
    @IsNotEmpty({message: 'El campo nombre es requerido'})
    @IsString({message: 'El campo nombre debe ser una cadena de texto'})
    @IsDateString({strictSeparator: true}, {message: 'El campo fecha debe ser una fecha valida'})
    date: Date


    @ApiProperty({
        example: 'Sin cebolla por favor',
        description: 'Debe ser una cadena de texto',
        required: true
    })
    @IsNotEmpty({message: 'El campo descripcion es requerido'})
    @IsString({message: 'El campo descripcion debe ser una cadena de texto'})
    description: string

    @ApiProperty({
        example: 1,
        description: 'Debe ser un numero mayor o igual a 1',
        required: true
    })
    @IsNotEmpty({message: 'El campo restaurante es requerido'})
    @IsNumber({}, {message: 'El campo restaurante debe ser un numero entero positivo'})
    @Min(1, {message: 'El campo restaurante debe ser un numero entero positivo'})
    restaurant: number


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
        example: [
            {
                id_plato: 1,
                cantidad: 1
            }
        ],
        description: 'Debe ser una lista o arreglo de objetos con clave id_plato numerico y cantidad numerico',
        required: true
    })
    @IsNotEmpty({message: 'El campo platos es requerido'})
    @IsArray({message: 'El campo platos debe ser una lista de platos con su identificador y la cantidad respectiva'})
    @ArrayMinSize(1, {message: 'El campo platos no puede estar vacio'})
    dishes: OrderInterfaces[]


}