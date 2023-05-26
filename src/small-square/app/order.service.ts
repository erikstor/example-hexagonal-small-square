import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  DishRepository,
  OrderRepository,
  OrderDishRepository,
  RestaurantRepository,
  RestaurantEmployeeRepository,
} from '../infra/repositories';
import {
  PedidosEntity,
  PedidosPlatosEntity,
  PlatosEntity,
} from '../domain/entities';
import { AssignOrder, OrderCreateDto, UpdateStatusOrder } from './dto';
import { TokenUser } from './interfaces';
import { estados } from './interfaces/order.interfaces';
import { RestaurantService } from './restaurant.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly dishRepository: DishRepository,
    private readonly orderRepository: OrderRepository,
    private readonly orderDishRepository: OrderDishRepository,
    private readonly restaurantRepository: RestaurantRepository,
    private readonly restaurantEmployeeRepository: RestaurantEmployeeRepository,
    private readonly restaurantService: RestaurantService,
  ) {}

  async createOrder(
    data: OrderCreateDto,
    client: TokenUser,
  ): Promise<{
    order: PedidosEntity;
    items: PedidosPlatosEntity[];
  }> {
    const existOrderInProcess: PedidosEntity = await this.findClientWithOrder(
      +client.id,
    );
    if (existOrderInProcess) {
      throw new BadRequestException(
        'Este usuario ya tiene una orden en proceso',
      );
    }

    const restaurant = await this.restaurantRepository.findOneBy({
      id: data.restaurant,
    });

    if (!restaurant) throw new BadRequestException('El restaurante no existe');

    const chef = await this.restaurantEmployeeRepository.findOneBy({
      restaurante: data.restaurant,
      id_usuario: data.chef,
    });

    if (!chef) {
      throw new BadRequestException('El chef no existe en ese restaurante');
    }

    const arrDishesId = data.dishes.map((current) => current.id_plato);
    const [platos, count] = await this.searchDishesInRestaurant(
      arrDishesId,
      data.restaurant,
    );

    if (count === 0 || count !== arrDishesId.length) {
      throw new BadRequestException(
        'Uno o varios platos no pertenecen al restaurante',
      );
    }
    try {
      const orderToSave = new PedidosEntity();

      orderToSave.fecha = data.date;
      orderToSave.id_cliente = client.id;
      orderToSave.descripcion = data.description;
      orderToSave.id_restaurante = data.restaurant;
      orderToSave.id_chef = data.chef;

      const order = await this.orderRepository.save(orderToSave);
      
      const orderDishes = [];

      for (const item of data.dishes) {
        const orderDish = await this.orderDishRepository.create({
          platos: item.id_plato,
          cantidad: item.cantidad,
          pedido: order.id,
        });

        orderDishes.push(orderDish);
      }

      const result: PedidosPlatosEntity[] = await this.orderDishRepository.save(
        orderDishes,
      );

      return { order, items: result };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findClientWithOrder(client: number): Promise<PedidosEntity> {
    try {
      return this.orderRepository.findOneBy({
        id_cliente: client,
        estado: estados.PREP,
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async searchDishesInRestaurant(
    dishes: number[],
    restaurante: number,
  ): Promise<[PlatosEntity[], number]> {
    try {
      return this.dishRepository
        .createQueryBuilder('platos')
        .where(
          'platos.id in (:...dishes) and platos.restauranteId = :restaurante',
          {
            dishes,
            restaurante,
          },
        )
        .innerJoin(
          'platos.restaurante',
          'restaurante',
          'platos.restaurante = restaurante.id',
        )
        .getManyAndCount();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getOrders({
    take,
    skip,
    status,
    restaurant,
  }: {
    take: number;
    skip: number;
    restaurant: number;
    status: string;
  }) {
    try {
      const [data, count] = await this.orderRepository
        .createQueryBuilder('pedidos')
        .skip(skip)
        .take(take)
        .where('pedidos.estado = :status', { status })
        .andWhere('pedidos.id_restaurante = :restaurant', { restaurant })
        .innerJoinAndSelect('pedidos.pedidos_platos', 'pedidos_platos')
        .innerJoinAndSelect('pedidos_platos.platos', 'platos')
        .getManyAndCount();

      return {
        data,
        count,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async assignOrder(data: AssignOrder): Promise<PedidosEntity> {
    try {
      const restaurant = await this.restaurantService.getRestaurantById(
        data.restaurant,
      );

      if (!restaurant)
        throw new BadRequestException('El restaurante no existe');

      const order = await this.getOrderById(data.order);

      if (order.id_restaurante !== restaurant.id)
        throw new BadRequestException(
          'El pedido no le pertenece a este restaurante',
        );

      if (order.id_chef && order.id_chef !== null)
        throw new BadRequestException('El pedido ya se encuentra asignado');

      const employeeRestaurant =
        await this.restaurantService.getEmployeeRestaurantByIds(
          data.chef,
          data.restaurant,
        );

      if (!employeeRestaurant)
        throw new BadRequestException(
          'El chef no esta relacionado con ese restaurante',
        );

      order.id_chef = employeeRestaurant.id;

      return this.orderRepository.save(order);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getOrderById(id: number): Promise<PedidosEntity> {
    const order = this.orderRepository.findOneBy({ id });

    if (!order) throw new BadRequestException('El pedido no existe');

    return order;
  }

  async updateStatusToDeliberyOrder(
    data: UpdateStatusOrder,
  ): Promise<PedidosEntity> {
    try {
      const order = await this.getOrderById(data.order);

      if (data.status === estados.DELIBERY && order.estado !== estados.READY) {
        throw new BadRequestException(
          'El pedido que intenta marca como entregado aun no esta listo',
        );
      }

      if (order.estado === estados.DELIBERY && data.status !== estados.READY) {
        throw new BadRequestException(
          'Los pedidos que fueron entregados solamente pueden ser actualizados al estados "Listo"',
        );
      }

      // TODO: agregar pin de seguridad en la entidad y validarlo en el body
      return this.updateStatusOrder(order, data.status);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updateStatusToPendingOrder(
    data: UpdateStatusOrder,
  ): Promise<PedidosEntity> {
    try {
      const order = await this.getOrderById(data.order);

      if (order.estado !== estados.PEN) {
        throw new BadRequestException(
          'Lo sentimos, tu pedido ya está en preparación y no puede cancelarse',
        );
      }

      return this.updateStatusOrder(order, data.status);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updateStatusOrder(
    order: PedidosEntity,
    status: string,
  ): Promise<PedidosEntity> {
    try {
      order.estado = estados[status];

      return this.orderRepository.save(order);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
