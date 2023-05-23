import {IsNotEmpty, IsNumber, IsString, Min, Validate} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {
    UrlFieldValidator
} from "../../infra/validators/restaurant.validator";


export class DishCreateDto {

    @ApiProperty({
        example: 'Plato 1',
        description: 'Debe ser una cadena de texto',
        required: true
    })
    @IsNotEmpty({message: 'El campo nombre es requerido'})
    @IsString({message: 'El campo nombre debe ser una cadena de texto'})
    nombre: string

    @ApiProperty({
        example: 1234567,
        description: 'Debe ser un numero mayor o igual a 1',
        required: true
    })
    @IsNotEmpty({message: 'El campo precio es requerido'})
    @IsNumber({}, {message: 'El campo precio debe ser un numero entero positivo'})
    @Min(1, {message: 'El campo precio debe ser un numero entero positivo'})
    precio: number

    @ApiProperty({
        example: 'El plato mas delicioso del mundo',
        description: 'Debe ser una cadena de texto',
        required: true
    })
    @IsNotEmpty({message: 'El campo descripcion es requerido'})
    @IsString({message: 'El campo descripcion debe ser una cadena de texto'})
    descripcion: string

    @ApiProperty({
        example: 'https://www.example.com/imagen.png',
        description: 'Debe ser una cadena de texto',
        required: true
    })
    @IsNotEmpty({message: 'El campo url_imagen es requerido'})
    @IsString({message: 'El campo url_imagen debe ser una cadena de texto'})
    @Validate(UrlFieldValidator,
        {message: 'La url de la imagen debe ser una url_imagen valida'}
    )
    url_imagen: string

    @ApiProperty({
        example: 1,
        description: 'Debe ser un numero',
        required: true
    })
    @IsNotEmpty({message: 'El campo restaurante es requerido'})
    @IsNumber({}, {message: 'El campo restaurante debe ser un numero'})
    restaurante: number


    @ApiProperty({
        example: 1,
        description: 'Debe ser un numero',
        required: true
    })
    @IsNotEmpty({message: 'El campo categoria es requerido'})
    @IsNumber({}, {message: 'El campo categoria debe ser un numero'})
    categoria: number


}