import {Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Req, Res, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {DishCreateDto, RestaurantCreateDto, DishUpdateDto, DishSetActiveDto} from "../../app/dto";
import {RestaurantService} from "../../app/restaurant.service";
import {OwnerGuard, AdminGuard, ClientGuard} from "../guards";

@ApiTags('Restaurante')
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
    getRestaurants(@Query() query: { take: number, skip: number }) {
        return this.restaurantService.getRestaurants(query)
    }

    @Get('/dish/')
    @ApiBearerAuth()
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
    getDish(@Query() query: { take: number, skip: number }) {
        return this.restaurantService.getDishs(query)
    }


    // TODO: continuar con este endpoint
    // @Post('/order/')
    // @ApiBearerAuth()
    // @ApiQuery({
    //     name: 'take',
    //     description: 'Cantidad de platos a mostrar',
    //     type: 'number',
    //     example: 10
    // })
    // @ApiQuery({
    //     name: 'skip',
    //     description: 'Determina cuantos platos se va asaltar antes de empezar a contar el valor de take',
    //     type: 'number',
    //     example: 1
    // })
    // @ApiOperation({summary: 'Muestra los platos con base a la paginacion'})
    // @ApiResponse({status: 200, description: 'Retorna un listado de platos'})
    // @ApiResponse({status: 400, description: 'Alguno de los parametros enviados en el body son incorrectos'})
    // @ApiResponse({status: 401, description: 'Debe de tener el rol cliente'})
    // @ApiResponse({status: 500, description: 'Error en el servidor'})
    // @UseGuards(ClientGuard)
    // createOrder(@Query() query: { take: number, skip: number }) {
    //     return this.restaurantService.getDishs(query)
    // }
}
