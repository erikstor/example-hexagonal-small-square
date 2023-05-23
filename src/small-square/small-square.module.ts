import {Module} from '@nestjs/common';
import {RestaurantController} from "./infra/controllers/restaurant.controller";
import {UsersService} from "./app/users.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthService} from './app/auth.service';
import {JwtModule, JwtService} from "@nestjs/jwt";
import {
    CategoriaEntity,
    PedidosEntity,
    PedidosPlatosEntity, PlatosEntity,
    RestauranteEmpleadoEntity,
    RestaurantesEntity
} from "./domain/entities";
import {RestaurantService} from "./app/restaurant.service";
import {RestaurantRepository, RoleRepository, UserRepository, DishRepository} from "./infra/repositories";

@Module({
    controllers: [RestaurantController],
    providers: [
        UsersService,
        UserRepository,
        RoleRepository,
        AuthService,
        JwtService,
        RestaurantService,
        RestaurantRepository,
        DishRepository
    ],
    imports: [
        TypeOrmModule.forFeature([
            CategoriaEntity,
            PedidosEntity,
            PedidosPlatosEntity,
            PlatosEntity,
            RestauranteEmpleadoEntity,
            RestaurantesEntity,
        ]),
        JwtModule.register({secret: 'hard!to-guess_secret'})
    ],
    exports: [
        RestaurantService
    ]
})
export class SmallSquareModule {
}
