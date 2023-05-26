import {BadRequestException, Injectable, InternalServerErrorException,} from '@nestjs/common';
import {
    CategoryRepository,
    DishRepository,
    OrderDishRepository,
    OrderRepository,
    RestaurantEmployeeRepository,
    RestaurantRepository
} from "../infra/repositories";
import {DishCreateDto, DishUpdateDto, OrderCreateDto, RestaurantCreateDto} from "./dto";
import {PedidosEntity, PedidosPlatosEntity, PlatosEntity, RestaurantesEntity} from "../domain/entities";
import {HttpService} from "./http.service";
import {ConfigService} from "@nestjs/config";
import {OWNER_ROLE} from "../infra/utils/constants/global";
import {estados} from "./interfaces/order.interfaces";
import {TokenUser} from "./interfaces";
import {RegisterEmployeeDto} from "./dto/registerEmployee.dto";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class RestaurantService {

    constructor(
        private readonly configService: ConfigService,
        private readonly categoryRepository: CategoryRepository,
        private readonly dishRepository: DishRepository,
        private readonly orderRepository: OrderRepository,
        private readonly orderDishRepository: OrderDishRepository,
        private readonly restaurantRepository: RestaurantRepository,
        private readonly restaurantEmployeeRepository: RestaurantEmployeeRepository,
        private readonly httpService: HttpService,
        private readonly jwtService: JwtService
    ) {
    }

    async create(restaurant: RestaurantCreateDto, token: string): Promise<any> {

        try {

            const {data} = await this.httpService.request({
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                url: `${this.configService.get('BASE_URL_USERS_MICROSERVICE')}?id=${restaurant.id_propietario}`,
            })

            if (data.role.nombre !== OWNER_ROLE) throw new BadRequestException('El usuario debe ser propietario')

            const restaurantesEntity = new RestaurantesEntity()

            restaurantesEntity.nombre = restaurant.nombre
            restaurantesEntity.nit = restaurant.nit
            restaurantesEntity.direccion = restaurant.direccion
            restaurantesEntity.id_propietario = restaurant.id_propietario
            restaurantesEntity.telefono = restaurant.telefono
            restaurantesEntity.url_logo = restaurant.url_logo

            return this.restaurantRepository.save(restaurantesEntity)
        } catch (e) {
            throw new InternalServerErrorException({
                message: 'Ocurrio un fallo en el guardado del restaurante',
                detail: e
            })
        }
    }

    async createDish(data: DishCreateDto): Promise<PlatosEntity> {

        const categoria = await this.categoryRepository.findOne({
            where: {
                id: data.categoria
            }
        })

        if (!categoria) throw new BadRequestException('No se encontro la categoria')

        const restaurante = await this.restaurantRepository.findOne({
            where: {
                id: data.restaurante
            }
        })

        if (!restaurante) throw new BadRequestException('No se encontro el restaurante')

        const plato = new PlatosEntity()

        try {
            return this.saveDish(plato, data)
        } catch (e) {
            throw new InternalServerErrorException('Ocurrio un fallo en el guardado del plato')
        }

    }


    async updateDish(id: number, data: DishUpdateDto) {

        if (data.categoria) {
            const categoria = await this.categoryRepository.findOne({
                where: {
                    id: data.categoria
                }
            })

            if (!categoria) throw new BadRequestException('No se encontro la categoria')
        }

        if (data.restaurante) {
            const restaurante = await this.restaurantRepository.findOne({
                where: {
                    id: data.restaurante
                }
            })

            if (!restaurante) throw new BadRequestException('No se encontro el restaurante')
        }

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


    async getRestaurants({take, skip}: { take: number, skip: number }) {
        try {

            const [result, total] = await this.restaurantRepository.findAndCount(
                {
                    take: take,
                    skip: skip,
                    select: [
                        "nombre",
                        "url_logo"
                    ],
                    order: {
                        nombre: "ASC"
                    }
                },
            );

            return {
                data: result,
                count: total
            }

        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }


    async getDishs({take, skip}: { take: number, skip: number }): Promise<{ data: PlatosEntity[], count: number }> {
        try {
            const [data, count] = await this.dishRepository.createQueryBuilder('platos')
                .skip(skip)
                .take(take)
                .where("platos.activo = true")
                .innerJoinAndSelect('platos.categoria', 'categoria', 'platos.categoria = categoria.id')
                .groupBy('categoria')
                .addGroupBy('platos.id')
                .addGroupBy('categoria.id')
                .select([
                    'platos.id',
                    'platos.nombre',
                    'platos.descripcion',
                    'platos.precio',
                    'platos.url_imagen',
                    'categoria'
                ])
                .getManyAndCount()

            return {
                data,
                count
            }

        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }

    async createOrder(data: OrderCreateDto, client: TokenUser): Promise<{
        order: PedidosEntity,
        items: PedidosPlatosEntity[]
    }> {
        try {

            const existOrderInProcess: PedidosEntity = await this.findClientWithOrder(+client.id)
            if (existOrderInProcess) throw new BadRequestException('Este usuario ya tiene una orden en proceso')

            const restaurant = await this.restaurantRepository.findOneBy({
                id: data.restaurant
            })

            if (!restaurant) throw new BadRequestException('El restaurante no existe')

            const chef = await this.restaurantEmployeeRepository.findOneBy({
                restaurante: data.restaurant,
                id_usuario: data.chef
            })

            if (!chef) throw new BadRequestException('El chef no existe en ese restaurante')

            const arrDishesId = data.dishes.map((current) => current.id_plato)
            const [platos, count] = await this.searchDishesInRestaurant(arrDishesId, data.restaurant)

            if (count === 0 || count !== arrDishesId.length) throw new BadRequestException('Uno o varios platos no pertenecen al restaurante')

            const orderToSave = new PedidosEntity()

            orderToSave.fecha = data.date
            orderToSave.id_cliente = client.id
            orderToSave.descripcion = data.description
            orderToSave.id_restaurante = data.restaurant
            orderToSave.id_chef = data.chef

            const order = await this.orderRepository.save(orderToSave)

            const orderDishes = []

            for (const item of data.dishes) {

                const orderDish = await this.orderDishRepository.create({
                    platos: item.id_plato,
                    cantidad: item.cantidad,
                    pedido: order.id
                })

                orderDishes.push(orderDish)
            }

            const result: PedidosPlatosEntity[] = await this.orderDishRepository.save(orderDishes)

            return {order, items: result}
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }

    async findClientWithOrder(client: number): Promise<PedidosEntity> {
        try {
            return this.orderRepository.findOneBy({
                id_cliente: client,
                estado: estados.PREP
            })
        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }

    async searchDishesInRestaurant(dishes: number[], restaurante: number): Promise<[PlatosEntity[], number]> {

        try {
            return this.dishRepository.createQueryBuilder('platos')
                .where("platos.id in (:...dishes) and platos.restauranteId = :restaurante", {
                    dishes, restaurante
                })
                .innerJoin('platos.restaurante', 'restaurante', 'platos.restaurante = restaurante.id')
                .getManyAndCount()
        } catch (e) {
            throw new InternalServerErrorException(e)
        }

    }


    async registerEmployee(employee: RegisterEmployeeDto) {
        try {

            const userToSave = {...employee}

            delete userToSave.restaurante

            const {data} = await this.httpService.request({
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                url: `${this.configService.get('BASE_URL_USERS_MICROSERVICE')}/sign-up`,
                data: userToSave
            })

            const employeeRegistered = await this.jwtService.decode(data.access_token)

            employeeRegistered['restaurantEmployee'] = await this.restaurantEmployeeRepository.save({
                restaurante: employee.restaurante,
                id_usuario: employeeRegistered['id']
            })

            return {
                employeeRegistered
            }

        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }


    async getOrders({take, skip, status, restaurant}: {
        take: number,
        skip: number,
        restaurant: number,
        status: string
    }) {
        try {


            const [data, count] = await this.orderRepository.createQueryBuilder('pedidos')
                .skip(skip)
                .take(take)
                .where("pedidos.estado = :status", {status},)
                .andWhere("pedidos.id_restaurante = :restaurant", {restaurant})
                .innerJoinAndSelect('pedidos.pedidos_platos', 'pedidos_platos')
                .innerJoinAndSelect('pedidos_platos.platos', 'platos')
                .getManyAndCount()

            return {
                data,
                count
            }

        } catch (e) {
            throw new InternalServerErrorException(e)
        }
    }

}
