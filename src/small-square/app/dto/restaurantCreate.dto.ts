import {IsNotEmpty, IsNumber, IsString, Min, MinLength, Validate} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {
    NombreFieldValidator,
    TelefonoFieldValidator,
    UrlFieldValidator
} from "../../infra/validators/restaurant.validator";


export class RestaurantCreateDto {

    @ApiProperty({
        example: 'Restaurante 1',
        description: 'Debe ser una cadena de texto, puede contener numeros pero no puede ser conformado solo por ellos',
        required: true
    })
    @IsNotEmpty({message: 'El campo nombre es requerido'})
    @IsString({message: 'El campo nombre debe ser una cadena de texto'})
    @Validate(NombreFieldValidator, {message: 'El campo nombre no puede estar compuesto solo por numeros'})
    nombre: string

    @ApiProperty({
        example: 1234567,
        description: 'Debe ser un numero mayor o igual a 1',
        required: true
    })
    @IsNotEmpty({message: 'El campo nit es requerido'})
    @IsNumber({}, {message: 'El campo nit debe ser un numero entero positivo'})
    @Min(1, {message: 'El campo nit debe ser un numero entero positivo'})
    nit: string

    @ApiProperty({
        example: 'calle falsa # 123 - 1',
        description: 'Debe ser una cadena de texto',
        required: true
    })
    @IsNotEmpty({message: 'El campo direccion es requerido'})
    @IsString({message: 'El campo direccion debe ser una cadena de texto'})
    direccion: string

    @ApiProperty({
        example: '+573153226435',
        description: 'Debe ser una cadena de texto',
        required: true
    })
    @IsNotEmpty({message: 'El campo telefono es requerido'})
    @IsString({message: 'El campo telefono debe ser una cadena de texto'})
    @MinLength(13)
    @Validate(TelefonoFieldValidator,
        {message: 'El telefono no tiene el formato correcto, si es un celular debe agregar el "+"'}
    )
    telefono: string

    @ApiProperty({
        example: 'https://www.example.com',
        description: 'Debe ser una cadena de texto',
        required: true
    })
    @IsNotEmpty({message: 'El campo url es requerido'})
    @IsString({message: 'El campo url debe ser una cadena de texto'})
    @Validate(UrlFieldValidator,
        {message: 'La url de la imagen debe ser una url valida'}
    )
    url_logo: string

    @ApiProperty({
        example: 1,
        description: 'Debe ser un numero',
        required: true
    })
    @IsNotEmpty({message: 'El campo propietario es requerido'})
    @IsNumber({}, {message: 'El campo propietario debe ser un numero'})
    id_propietario: number

}