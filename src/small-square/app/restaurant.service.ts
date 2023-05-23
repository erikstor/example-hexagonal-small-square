import {BadRequestException, Injectable, InternalServerErrorException,} from '@nestjs/common';
import {RestaurantRepository, DishRepository} from "../infra/repositories";
import {RestaurantCreateDto, DishCreateDto} from "./dto";
import {PlatosEntity, RestaurantesEntity} from "../domain/entities";
import {DishUpdateDto} from "./dto/dishUpdate.dto";

@Injectable()
export class RestaurantService {

    constructor(
        private readonly restaurantRepository: RestaurantRepository,
        private readonly dishRepository: DishRepository,
    ) {
    }

    async create(data: RestaurantCreateDto): Promise<any> {

        // todo validar que el usuario sea propietario

        const restaurant = new RestaurantesEntity()

        restaurant.nombre = data.nombre
        restaurant.nit = data.nit
        restaurant.direccion = data.direccion
        restaurant.id_propietario = data.id_propietario
        restaurant.telefono = data.telefono
        restaurant.url_logo = data.url_logo

        try {
            return this.restaurantRepository.save(data)
        } catch (e) {
            throw new InternalServerErrorException('Ocurrio un fallo en el guardado del restaurante')
        }
    }

    async createDish(data: DishCreateDto): Promise<PlatosEntity> {

        // todo validar categoria y restaurant contra la base de datos

        const plato = new PlatosEntity()

        try {
            return this.saveDish(plato, data)
        } catch (e) {
            throw new InternalServerErrorException('Ocurrio un fallo en el guardado del plato')
        }

    }


    async updateDish(id: number, data: DishUpdateDto) {


        // todo validar categoria y restaurant contra la base de datos


        const plato: PlatosEntity | null = await this.dishRepository.findOneBy({
            id,
            restaurante: data.restaurante
        })

        if (!plato) throw new BadRequestException({message: 'El plato no fue encontrado'})

        try {
            return this.saveDish(plato, data)
        } catch (e) {
            throw new InternalServerErrorException(e)
        }

    }

    saveDish(dish: PlatosEntity, data: DishUpdateDto) {

        dish.nombre = data.nombre
        dish.precio = data.precio
        dish.descripcion = data.descripcion
        dish.url_imagen = data.url_imagen
        dish.categoria = data.categoria
        dish.restaurante = data.restaurante
        dish.activo = data.activo

        return this.dishRepository.save(dish)
    }

}
