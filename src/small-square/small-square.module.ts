import {Module} from '@nestjs/common';
import {RestaurantController} from "./infra/controllers/restaurant.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {
    CategoriaEntity,
    PedidosEntity,
    PedidosPlatosEntity, PlatosEntity,
    RestauranteEmpleadoEntity,
    RestaurantesEntity
} from "./domain/entities";
import {RestaurantService} from "./app/restaurant.service";
import {
    RestaurantRepository,
    DishRepository,
    CategoryRepository, OrderRepository, RestaurantEmployeeRepository, OrderDishRepository
} from "./infra/repositories";
import {HttpService} from "./app/http.service";
import {ConfigService} from "@nestjs/config";
import {UsuariosEntity} from "./domain/entities/usuarios.entity";
import {RolesEntity} from "./domain/entities/roles.entity";

@Module({
    controllers: [RestaurantController],
    providers: [
        ConfigService,
        JwtService,
        RestaurantService,
        RestaurantRepository,
        DishRepository,
        HttpService,
        CategoryRepository,
        OrderRepository,
        OrderDishRepository,
        RestaurantEmployeeRepository
    ],
    imports: [
        TypeOrmModule.forFeature([
            CategoriaEntity,
            PedidosEntity,
            PedidosPlatosEntity,
            PlatosEntity,
            RestauranteEmpleadoEntity,
            RestaurantesEntity,
            UsuariosEntity,
            RolesEntity
        ]),
        JwtModule.register({secret: 'hard!to-guess_secret'})
    ],
    exports: [
        RestaurantService
    ]
})
export class SmallSquareModule {
}
