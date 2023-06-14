import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TestingModule, Test } from '@nestjs/testing';
import {
  RestaurantCreateDto,
  DishCreateDto,
  DishUpdateDto,
} from '../../src/small-square/app/dto';
import { HttpService } from '../../src/small-square/app/http.service';
import { RestaurantService } from '../../src/small-square/app/restaurant.service';
import {
  RestaurantesEntity,
  PlatosEntity,
  CategoriaEntity,
} from '../../src/small-square/domain/entities';
import {
  CategoryRepository,
  DishRepository,
  RestaurantRepository,
  RestaurantEmployeeRepository,
} from '../../src/small-square/infra/repositories';
import { OWNER_ROLE } from '../../src/small-square/infra/utils/constants/global';
import { AppModule } from '../../src/app.module';
import { Response } from 'express';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let categoryRepository: CategoryRepository;
  let dishRepository: DishRepository;
  let restaurantRepository: RestaurantRepository;
  let restaurantEmployeeRepository: RestaurantEmployeeRepository;
  let httpService: HttpService;
  let configService: ConfigService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        RestaurantService,
        CategoryRepository,
        DishRepository,
        RestaurantRepository,
        RestaurantEmployeeRepository,
        HttpService,
        ConfigService,
        JwtService,
      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
    dishRepository = module.get<DishRepository>(DishRepository);
    restaurantRepository =
      module.get<RestaurantRepository>(RestaurantRepository);
    restaurantEmployeeRepository = module.get<RestaurantEmployeeRepository>(
      RestaurantEmployeeRepository,
    );
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);


    await module.close()

  });

  describe('create', () => {
    it('should create a restaurant and return the saved entity', async () => {
      // Arrange
      const restaurant: RestaurantCreateDto = {
        nombre: 'Test Restaurant',
        nit: '123456789',
        direccion: 'Test Address',
        id_propietario: 123,
        telefono: '1234567890',
        url_logo: 'test-url',
      };
      const token = 'test-token';
      const userData = {
        role: {
          nombre: OWNER_ROLE,
        },
      };
      const expectedResult = new RestaurantesEntity();
      expectedResult.nombre = restaurant.nombre;
      expectedResult.nit = restaurant.nit;
      expectedResult.direccion = restaurant.direccion;
      expectedResult.id_propietario = restaurant.id_propietario;
      expectedResult.telefono = restaurant.telefono;
      expectedResult.url_logo = restaurant.url_logo;
      jest.spyOn(httpService, 'request').mockResolvedValue({ data: userData });
      jest
        .spyOn(restaurantRepository, 'save')
        .mockResolvedValue(expectedResult);

      // Act
      const result = await service.create(restaurant, token);

      // Assert
      expect(httpService.request).toHaveBeenCalledWith({
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        url: `${configService.get('BASE_URL_USERS_MICROSERVICE')}?id=${
          restaurant.id_propietario
        }`,
      });
      expect(restaurantRepository.save).toHaveBeenCalledWith(expectedResult);
      expect(result).toBe(expectedResult);
    });

    it('should throw BadRequestException if the user role is not OWNER_ROLE', async () => {
      // Arrange
      const restaurant: RestaurantCreateDto = {
        nombre: 'Test Restaurant',
        nit: '123456789',
        direccion: 'Test Address',
        id_propietario: 123,
        telefono: '1234567890',
        url_logo: 'test-url',
      };
      const token = 'test-token';
      const userData = {
        role: {
          nombre: 'OTHER_ROLE',
        },
      };
      jest.spyOn(httpService, 'request').mockResolvedValue({ data: userData });

      // Act
      try {
        await service.create(restaurant, token);
      } catch (error) {
        expect(error.response.detail).toBeInstanceOf(BadRequestException);
        expect(error.response.detail.response.message).toBe(
          'El usuario debe ser propietario',
        );
      }
    });
  });

  describe('createDish', () => {
    it('should create a dish and return the saved entity', async () => {
      // Arrange
      const dish: DishCreateDto = {
        nombre: 'Test Dish',
        precio: 10.99,
        descripcion: 'Test Description',
        url_imagen: 'test-url',
        categoria: 1,
        restaurante: 1,
      };
      const categoria: CategoriaEntity = {
        id: dish.categoria,
        nombre: '',
        descripcion: '',
        plato: new PlatosEntity(),
      };
      const restaurante: RestaurantesEntity = {
        id: dish.restaurante,
        nombre: '',
        direccion: '',
        telefono: '',
        url_logo: '',
        nit: '',
        id_propietario: 0,
        platos: new PlatosEntity(),
      };
      const expectedResult = new PlatosEntity();
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(categoria);
      jest
        .spyOn(restaurantRepository, 'findOne')
        .mockResolvedValue(restaurante);
      jest.spyOn(service, 'saveDish').mockResolvedValue(expectedResult);

      // Act
      const result = await service.createDish(dish);

      // Assert
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: dish.categoria },
      });
      expect(restaurantRepository.findOne).toHaveBeenCalledWith({
        where: { id: dish.restaurante },
      });
      expect(service.saveDish).toHaveBeenCalledWith(expectedResult, dish);
      expect(result).toBe(expectedResult);
    });

    it('should throw BadRequestException if the category is not found', async () => {
      // Arrange
      const dish: DishCreateDto = {
        nombre: 'Test Dish',
        precio: 10.99,
        descripcion: 'Test Description',
        url_imagen: 'test-url',
        categoria: 1,
        restaurante: 1,
      };
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      // Act
      try {
        await service.createDish(dish);
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('No se encontro la categoria');
      }
    });

    it('should throw BadRequestException if the restaurant is not found', async () => {
      // Arrange
      const dish: DishCreateDto = {
        nombre: 'Test Dish',
        precio: 10.99,
        descripcion: 'Test Description',
        url_imagen: 'test-url',
        categoria: 1,
        restaurante: 1,
      };
      const categoria: CategoriaEntity = {
        id: dish.categoria,
        nombre: '',
        descripcion: '',
        plato: new PlatosEntity(),
      };
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(categoria);
      jest.spyOn(restaurantRepository, 'findOne').mockResolvedValue(null);

      // Act
      try {
        await service.createDish(dish);
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('No se encontro el restaurante');
      }
    });
  });

  describe('updateDish', () => {
    it('should update a dish and return the updated entity', async () => {
      // Arrange
      const id = 1;
      const dish: DishUpdateDto = {
        nombre: 'Updated Dish',
        precio: 15.99,
        descripcion: 'Updated Description',
        url_imagen: 'updated-url',
        categoria: 2,
        restaurante: 2,
        activo: true,
      };
      const categoria: CategoriaEntity = {
        id: dish.categoria,
        nombre: '',
        descripcion: '',
        plato: new PlatosEntity(),
      };
      const restaurante: RestaurantesEntity = {
        id: dish.restaurante,
        nombre: '',
        direccion: '',
        telefono: '',
        url_logo: '',
        nit: '',
        id_propietario: 0,
        platos: new PlatosEntity(),
      };
      const plato = new PlatosEntity();
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(categoria);
      jest
        .spyOn(restaurantRepository, 'findOne')
        .mockResolvedValue(restaurante);
      jest.spyOn(dishRepository, 'findOneBy').mockResolvedValue(plato);
      jest.spyOn(service, 'saveDish').mockResolvedValue(plato);

      // Act
      const result = await service.updateDish(id, dish);

      // Assert
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: dish.categoria },
      });
      expect(restaurantRepository.findOne).toHaveBeenCalledWith({
        where: { id: dish.restaurante },
      });
      expect(dishRepository.findOneBy).toHaveBeenCalledWith({
        id,
        restaurante: dish.restaurante,
      });
      expect(service.saveDish).toHaveBeenCalledWith(plato, dish);
      expect(result).toBe(plato);
    });

    it('should throw BadRequestException if the category is not found', async () => {
      // Arrange
      const id = 1;
      const dish: DishUpdateDto = {
        nombre: 'Updated Dish',
        precio: 15.99,
        descripcion: 'Updated Description',
        url_imagen: 'updated-url',
        categoria: 2,
        restaurante: 2,
        activo: true,
      };
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      // Act
      try {
        await service.updateDish(id, dish);
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('No se encontro la categoria');
      }
    });

    it('should throw BadRequestException if the restaurant is not found', async () => {
      // Arrange
      const id = 1;
      const dish: DishUpdateDto = {
        nombre: 'Updated Dish',
        precio: 15.99,
        descripcion: 'Updated Description',
        url_imagen: 'updated-url',
        categoria: 2,
        restaurante: 2,
        activo: true,
      };
      const categoria: CategoriaEntity = {
        id: dish.categoria,
        nombre: '',
        descripcion: '',
        plato: new PlatosEntity(),
      };
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(categoria);
      jest.spyOn(restaurantRepository, 'findOne').mockResolvedValue(null);

      // Act
      try {
        await service.updateDish(id, dish);
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('No se encontro el restaurante');
      }
    });

    it('should throw BadRequestException if the dish is not found', async () => {
      // Arrange
      const id = 1000;
      const dish: DishUpdateDto = {
        nombre: 'Updated Dish',
        precio: 15.99,
        descripcion: 'Updated Description',
        url_imagen: 'updated-url',
        categoria: 2,
        restaurante: 2,
        activo: true,
      };
      const categoria: CategoriaEntity = {
        id: dish.categoria,
        nombre: '',
        descripcion: '',
        plato: new PlatosEntity(),
      };
      const restaurante: RestaurantesEntity = {
        id: dish.restaurante,
        nombre: '',
        direccion: '',
        telefono: '',
        url_logo: '',
        nit: '',
        id_propietario: 0,
        platos: new PlatosEntity(),
      };
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(categoria);
      jest
        .spyOn(restaurantRepository, 'findOne')
        .mockResolvedValue(restaurante);
      jest.spyOn(dishRepository, 'findOneBy').mockResolvedValue(null);

      // Act
      try {
        await service.updateDish(id, dish);
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('El plato no fue encontrado');
      }
    });
  });
});
