import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  OrderCreateDto,
  AssignOrder,
  UpdateStatusOrder,
} from '../../src/small-square/app/dto';
import { estados } from '../../src/small-square/app/interfaces/order.interfaces';
import { OrderService } from '../../src/small-square/app/order.service';
import { RestaurantService } from '../../src/small-square/app/restaurant.service';
import {
  DishRepository,
  OrderRepository,
  OrderDishRepository,
  RestaurantRepository,
  RestaurantEmployeeRepository,
  CategoryRepository,
} from '../../src/small-square/infra/repositories';
import { AppModule } from '../../src/app.module';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '../../src/small-square/app/http.service';
import { JwtService } from '@nestjs/jwt';
import { RestaurantesEntity } from '../../src/small-square/domain/entities/restaurantes.entity';
import { RestauranteEmpleadoEntity } from '../../src/small-square/domain/entities/restaurante-empleado.entity';
import { TokenUser } from '../../src/small-square/app/interfaces/auth.interfaces';
import { PedidosEntity } from 'src/small-square/domain/entities';

describe('OrderService', () => {
  let orderService: OrderService;
  let dishRepository: DishRepository;
  let orderRepository: OrderRepository;
  let orderDishRepository: OrderDishRepository;
  let restaurantRepository: RestaurantRepository;
  let restaurantEmployeeRepository: RestaurantEmployeeRepository;
  let restaurantService: RestaurantService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        ConfigService,
        CategoryRepository,
        OrderService,
        DishRepository,
        OrderRepository,
        OrderDishRepository,
        RestaurantRepository,
        RestaurantEmployeeRepository,
        RestaurantService,
        HttpService,
        JwtService,
      ],
    }).compile();

    orderService = moduleRef.get<OrderService>(OrderService);
    dishRepository = moduleRef.get<DishRepository>(DishRepository);
    orderRepository = moduleRef.get<OrderRepository>(OrderRepository);
    orderDishRepository =
      moduleRef.get<OrderDishRepository>(OrderDishRepository);
    restaurantRepository =
      moduleRef.get<RestaurantRepository>(RestaurantRepository);
    restaurantEmployeeRepository = moduleRef.get<RestaurantEmployeeRepository>(
      RestaurantEmployeeRepository,
    );
    restaurantService = moduleRef.get<RestaurantService>(RestaurantService);

    await moduleRef.close()
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const mockClient: TokenUser = {
        id: 0,
        nombre: '',
        apellido: '',
        celular: '',
        dni: 0,
        correo: '',
        clave: '',
        role: undefined,
        iat: 0,
        exp: 0,
      };
      const mockRestaurant: RestaurantesEntity = {
        id: 1,
        nombre: '',
        direccion: '',
        telefono: '',
        url_logo: '',
        nit: '',
        id_propietario: 0,
        platos: undefined,
      };
      const mockChef: RestauranteEmpleadoEntity = {
        id: 0,
        id_usuario: 0,
        restaurante: 0,
      };
      const mockDishes = [{ id_plato: 1, cantidad: 2 }];

      jest.spyOn(orderService, 'findClientWithOrder').mockResolvedValue(null);
      jest
        .spyOn(restaurantRepository, 'findOneBy')
        .mockResolvedValue(mockRestaurant);
      jest
        .spyOn(restaurantEmployeeRepository, 'findOneBy')
        .mockResolvedValue(mockChef);
      jest.spyOn(dishRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[{ id: 1 }], 1]),
      } as any);
      jest.spyOn(orderRepository, 'save').mockResolvedValue({ id: 1 } as any);
      jest.spyOn(orderDishRepository, 'create').mockReturnValue({} as any);
      jest
        .spyOn(orderDishRepository, 'save')
        .mockResolvedValue([{ id: 1 }] as any);

      const orderCreateDto: OrderCreateDto = {
        date: new Date(),
        restaurant: 1,
        chef: 1,
        dishes: [{ id_plato: 1, cantidad: 2 }],
        description: 'Test Order',
      };

      const result = await orderService.createOrder(orderCreateDto, mockClient, '');

      expect(result.order).toEqual({ id: 1 });
      expect(result.items).toEqual([{ id: 1 }]);
    });

    it('should throw BadRequestException when client has an order in process', async () => {
      const mockClient: TokenUser = {
        id: 1,
        nombre: '',
        apellido: '',
        celular: '',
        dni: 0,
        correo: '',
        clave: '',
        role: undefined,
        iat: 0,
        exp: 0,
      };
      const mockOrder: PedidosEntity = {
        id: 1,
        fecha: undefined,
        estado: estados.PREP,
        descripcion: '',
        id_cliente: 0,
        id_restaurante: 0,
        pedidos_platos: undefined,
        codigo: 1231
      };

      jest
        .spyOn(orderService, 'findClientWithOrder')
        .mockResolvedValue(mockOrder);

      const orderCreateDto: OrderCreateDto = {
        date: new Date(),
        restaurant: 1,
        chef: 1,
        dishes: [{ id_plato: 1, cantidad: 2 }],
        description: 'Test Order',
      };

      await expect(
        orderService.createOrder(orderCreateDto, mockClient, ''),
      ).rejects.toThrow(BadRequestException);

    });

    // Add more test cases for other scenarios
  });

  describe('findClientWithOrder', () => {
    it('should find a client with an order in process', async () => {
      const mockClient = 1;
      const mockOrder: PedidosEntity = {
        id: 1,
        fecha: undefined,
        estado: estados.PREP,
        descripcion: '',
        id_cliente: 0,
        id_restaurante: 0,
        pedidos_platos: undefined,
        codigo: 1111
      };

      jest.spyOn(orderRepository, 'findOneBy').mockResolvedValue(mockOrder);

      const result = await orderService.findClientWithOrder(mockClient);

      expect(result).toEqual(mockOrder);
    });

    // Add more test cases for other scenarios
  });

  describe('searchDishesInRestaurant', () => {
    it('should search dishes in a restaurant successfully', async () => {
      const mockDishes = [1, 2];
      const mockRestaurant = 1;
      const mockPlatos = [{ id: 1 }, { id: 2 }];
      const mockCount = 2;

      jest.spyOn(dishRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockPlatos, mockCount]),
      } as any);

      const result = await orderService.searchDishesInRestaurant(
        mockDishes,
        mockRestaurant,
      );

      expect(result).toEqual([mockPlatos, mockCount]);
    });

    // Add more test cases for other scenarios
  });

  describe('getOrders', () => {
    it('should get orders successfully', async () => {
      const mockParams = { take: 10, skip: 0, status: 'CANCEL', restaurant: 1 };
      const mockData = [{ id: 1 }, { id: 2 }];
      const mockCount = 2;

      jest.spyOn(orderRepository, 'createQueryBuilder').mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockData, mockCount]),
      } as any);

      const result = await orderService.getOrders(mockParams);

      expect(result.data).toEqual(mockData);
      expect(result.count).toBe(mockCount);
    });

    // Add more test cases for other scenarios
  });

  describe('assignOrder', () => {
    it('should assign an order successfully', async () => {
      const mockData: AssignOrder = { restaurant: 1, order: 1, chef: 1 };
      const mockRestaurant: RestaurantesEntity = {
        id: 1,
        nombre: '',
        direccion: '',
        telefono: '',
        url_logo: '',
        nit: '',
        id_propietario: 0,
        platos: undefined,
      };
      const mockOrder: PedidosEntity = {
        id: 1,
        fecha: undefined,
        estado: estados.PEN,
        descripcion: '',
        id_cliente: 0,
        id_restaurante: 1,
        pedidos_platos: undefined,
        codigo: 1111
      };
      const mockEmployeeRestaurant: RestauranteEmpleadoEntity = {
        id: 1,
        id_usuario: 0,
        restaurante: 0,
      };

      jest
        .spyOn(restaurantService, 'getRestaurantById')
        .mockResolvedValue(mockRestaurant);
      jest.spyOn(orderService, 'getOrderById').mockResolvedValue(mockOrder);
      jest
        .spyOn(restaurantService, 'getEmployeeRestaurantByIds')
        .mockResolvedValue(mockEmployeeRestaurant);
      jest.spyOn(orderRepository, 'save').mockResolvedValue(mockOrder as any);

      const result = await orderService.assignOrder(mockData);

      expect(result).toEqual(mockOrder);
    });

    // Add more test cases for other scenarios
  });

  describe('getOrderById', () => {
    it('should get an order by ID successfully', async () => {
      const mockId = 1;
      const mockOrder: PedidosEntity = {
        id: 1,
        fecha: undefined,
        estado: estados.PEN,
        descripcion: '',
        id_cliente: 0,
        id_restaurante: 0,
        pedidos_platos: undefined,
        codigo: 11111
      };

      jest.spyOn(orderRepository, 'findOneBy').mockResolvedValue(mockOrder);

      const result = await orderService.getOrderById(mockId);

      expect(result).toEqual(mockOrder);
    });

    // Add more test cases for other scenarios
  });

  describe('updateStatusToDeliberyOrder', () => {
    it('should update the status of an order to DELIVERY', async () => {
      const mockData: UpdateStatusOrder = { order: 1, status: 'DELIVERY', code:111  };
      const mockOrder: PedidosEntity = {
        id: 1,
        fecha: undefined,
        estado: estados.READY,
        descripcion: '',
        id_cliente: 0,
        id_restaurante: 0,
        pedidos_platos: undefined,
        codigo: 111
      };

      jest.spyOn(orderService, 'getOrderById').mockResolvedValue(mockOrder);
      jest
        .spyOn(orderService, 'updateStatusOrder')
        .mockResolvedValue(mockOrder as any);

      const result = await orderService.updateStatusToDeliberyOrder(mockData, '');

      expect(result).toEqual(mockOrder);
    });

    // Add more test cases for other scenarios
  });

  describe('updateStatusToPendingOrder', () => {
    it('should update the status of an order to PENDING', async () => {
      const mockData: UpdateStatusOrder = { order: 1, status: 'PENDING', code:111 };
      const mockOrder: PedidosEntity = {
        id: 1,
        fecha: undefined,
        estado: estados.PEN,
        descripcion: '',
        id_cliente: 0,
        id_restaurante: 0,
        pedidos_platos: undefined,
        codigo: 12312
      };

      jest.spyOn(orderService, 'getOrderById').mockResolvedValue(mockOrder);
      jest
        .spyOn(orderService, 'updateStatusOrder')
        .mockResolvedValue(mockOrder as any);

      const result = await orderService.updateStatusToPendingOrder(mockData);

      expect(result).toEqual(mockOrder);
    });

    // Add more test cases for other scenarios
  });

  describe('updateStatusOrder', () => {
    it('should update the status of an order successfully', async () => {
      const mockOrder = { id: 1, estado: estados.PEN };
      const mockStatus = 'READY';

      jest.spyOn(orderRepository, 'save').mockResolvedValue(mockOrder as any);

      const result = await orderService.updateStatusOrder(
        mockOrder as any,
        mockStatus,
      );

      expect(result).toEqual(mockOrder);
    });

    // Add more test cases for other scenarios
  });
});
