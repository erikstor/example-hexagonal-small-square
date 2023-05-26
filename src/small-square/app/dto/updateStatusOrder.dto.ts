import {IsNotEmpty, IsNumber, IsString, Min, Validate} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import { StatusFieldValidator } from "src/small-square/infra/validators/order.validator";
import { estados } from "../interfaces/order.interfaces";


export class UpdateStatusOrder {

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
        example: 'READY',
        description: 'El campo estado debe ser una cadena de texto',
        required: true
    })
    @IsNotEmpty({message: 'El campo estado es requerido'})
    @IsString({message: 'El campo estado debe ser una cadena de texto'})
    @Validate(StatusFieldValidator,
        {message: 'El estado no contiene un valor valido'}
    )
    status: string

    //TODO: agregar validacion para el pin de seguridad en formato numerico

}