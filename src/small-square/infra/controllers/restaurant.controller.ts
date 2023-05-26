import {Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {DishCreateDto, RestaurantCreateDto, DishUpdateDto, DishSetActiveDto, OrderCreateDto} from "../../app/dto";
import {RestaurantService} from "../../app/restaurant.service";
import {OwnerGuard, AdminGuard, ClientGuard, EmployeeGuard} from "../guards";
import {RegisterEmployeeDto} from "../../app/dto/registerEmployee.dto";
import {estados} from "../../app/interfaces/order.interfaces";

@Controller('restaurants')
export class RestaurantController {

    constructor(
        private readonly restaurantService: RestaurantService
    ) {
    }


    @Post('/create')
    @ApiBody({
        type: RestaurantCreateDto,
    })
    @ApiBearerAuth()
    @ApiTags('Restaurante')
    @ApiOperation({summary: 'Registra un restaurante'})
    @ApiResponse({status: 200, description: 'Retorna un restaurante'})
    @ApiResponse({status: 400, description: 'Alguno de los parametros enviados en el body son incorrectos'})
    @ApiResponse({status: 401, description: 'Debe de tener el rol administrador'})
    @ApiResponse({status: 500, description: 'Error en el servidor'})
    @UseGuards(AdminGuard)
    create(@Req() req: Request, @Body() body: RestaurantCreateDto) {
        return this.restaurantService.create(body, req.headers['authorization'])
    }

    @Post('/dish/create')
    @ApiBody({
        type: DishCreateDto,
    })
    @ApiBearerAuth()
    @ApiTags('Platos')
    @ApiOperation({summary: 'Registra un plato'})
    @ApiResponse({status: 200, description: 'Retorna un plato'})
    @ApiResponse({status: 400, description: 'Alguno de los parametros enviados en el body son incorrectos'})
    @ApiResponse({status: 401, description: 'Debe de tener el rol propietario'})
    @ApiResponse({status: 500, description: 'Error en el servidor'})
    @UseGuards(OwnerGuard)
    dishCreate(@Body() body: DishCreateDto) {
        return this.restaurantService.createDish(body)
    }


    @Patch('/dish/update/:id')
    @ApiBody({
        type: DishUpdateDto,
    })
    @ApiBearerAuth()
    @ApiTags('Platos')
    @ApiOperation({summary: 'Actualiza un plato'})
    @ApiResponse({status: 200, description: 'Retorna un plato'})
    @ApiResponse({status: 400, description: 'Alguno de los parametros enviados en el body son incorrectos'})
    @ApiResponse({status: 401, description: 'Debe de tener el rol propietario'})
    @ApiResponse({status: 500, description: 'Error en el servidor'})
    @UseGuards(OwnerGuard)
    dishUpdate(@Param('id', ParseIntPipe) id: number, @Body() body: DishUpdateDto) {
        return this.restaurantService.updateDish(id, body)
    }


    @Patch('/dish/set-active/:id')
    @ApiBody({
        type: DishSetActiveDto,
    })
    @ApiBearerAuth()
    @ApiTags('Platos')
    @ApiOperation({summary: 'Actualiza el estado de un plato'})
    @ApiResponse({status: 200, description: 'Retorna un plato'})
    @ApiResponse({status: 400, description: 'Alguno de los parametros enviados en el body son incorrectos'})
    @ApiResponse({status: 401, description: 'Debe de tener el rol propietario'})
    @ApiResponse({status: 500, description: 'Error en el servidor'})
    @UseGuards(OwnerGuard)
    setActiveDish(@Param('id', ParseIntPipe) id: number, @Body() body: DishSetActiveDto) {
        return this.restaurantService.updateDish(id, body)
    }


    @Get('/')
    @ApiBearerAuth()
    @ApiTags('Restaurante')
    @ApiQuery({
        name: 'take',
        description: 'Cantidad de restaurantes a mostrar',
        type: 'number',
        example: 10
    })
    @ApiQuery({
        name: 'skip',
        description: 'Determina cuantos restaurantes se va asaltar antes de empezar a contar el valor de take',
        type: 'number',
        example: 1
    })
    @ApiOperation({summary: 'Muestra los restaurantes con base a la paginacion'})
    @ApiResponse({status: 200, description: 'Retorna un listado de restaurantes'})
    @ApiResponse({status: 400, description: 'Alguno de los parametros enviados en el body son incorrectos'})
    @ApiResponse({status: 401, description: 'Debe de tener el rol cliente'})
    @ApiResponse({status: 500, description: 'Error en el servidor'})
    @UseGuards(ClientGuard)
    //todo crear un dto para esto
    getRestaurants(@Query() query: { take: number, skip: number }) {
        return this.restaurantService.getRestaurants(query)
    }

    @Get('/dishs/')
    @ApiBearerAuth()
    @ApiTags('Platos')
    @ApiQuery({
        name: 'take',
        description: 'Cantidad de platos a mostrar',
        type: 'number',
        example: 10
    })
    @ApiQuery({
        name: 'skip',
        description: 'Determina cuantos platos se va asaltar antes de empezar a contar el valor de take',
        type: 'number',
        example: 1
    })
    @ApiOperation({summary: 'Muestra los platos con base a la paginacion'})
    @ApiResponse({status: 200, description: 'Retorna un listado de platos'})
    @ApiResponse({status: 400, description: 'Alguno de los parametros enviados en el body son incorrectos'})
    @ApiResponse({status: 401, description: 'Debe de tener el rol cliente'})
    @ApiResponse({status: 500, description: 'Error en el servidor'})
    @UseGuards(ClientGuard)
    //todo crear un dto para esto
    getDishs(@Query() query: { take: number, skip: number }) {
        return this.restaurantService.getDishs(query)
    }


    @Post('/order/')
    @ApiBearerAuth()
    @ApiTags('Ordenes')
    @ApiBody({
        type: OrderCreateDto,
    })
    @ApiOperation({summary: 'Registra una orden'})
    @ApiResponse({status: 200, description: 'Retorna un pedido'})
    @ApiResponse({status: 400, description: 'Alguno de los parametros enviados en el body son incorrectos'})
    @ApiResponse({status: 401, description: 'Debe de tener el rol cliente'})
    @ApiResponse({status: 500, description: 'Error en el servidor'})
    @UseGuards(ClientGuard)
    createOrder(@Req() req: Request, @Body() body: OrderCreateDto) {
        return this.restaurantService.createOrder(body, req['user'])
    }

    @Post('/register-employee')
    @ApiBearerAuth()
    @ApiTags('Empleado')
    @ApiBody({
        type: RegisterEmployeeDto,
    })
    @ApiOperation({
        summary: 'Endoint que consume el microservicio de usuarios para registrar un empleado y tambien lo asocia a un restaurante'
    })
    @ApiResponse({status: 200, description: 'Retorna un usuario de tipo propietario'})
    @ApiResponse({status: 400, description: 'Alguno de los parametros enviados en el body son incorrectos'})
    @ApiResponse({status: 500, description: 'Error en el servidor'})
    @UseGuards(OwnerGuard)
    registerEmployee(@Body() body: RegisterEmployeeDto) {
        return this.restaurantService.registerEmployee(body)
    }


    @Get('/orders/')
    @ApiBearerAuth()
    @ApiTags('Ordenes')
    @ApiQuery({
        name: 'take',
        description: 'Cantidad de platos a mostrar',
        type: 'number',
        example: 10
    })
    @ApiQuery({
        name: 'skip',
        description: 'Determina cuantos platos se va asaltar antes de empezar a contar el valor de take',
        type: 'number',
        example: 1
    })
    @ApiQuery({
        name: 'status',
        description: 'Estado por el que seran filtradas las ordenes',
        type: 'string',
        example: estados.PREP
    })
    @ApiQuery({
        name: 'restaurant',
        description: 'Restaurante al que pertenece el empleado',
        type: 'number',
        example: 1
    })
    @ApiOperation({summary: 'Muestra las ordenes con base a la paginacion y al filtro de estado'})
    @ApiResponse({status: 200, description: 'Retorna un listado de platos'})
    @ApiResponse({status: 400, description: 'Alguno de los parametros enviados en el body son incorrectos'})
    @ApiResponse({status: 401, description: 'Debe de tener el rol cliente'})
    @ApiResponse({status: 500, description: 'Error en el servidor'})
    // @UseGuards(EmployeeGuard)
    //todo crear un dto para esto
    getOrders(@Query() query: { take: number, skip: number, restaurant: number, status: string }) {
        return this.restaurantService.getOrders(query)
    }


}
