import {Body, Controller, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {DishCreateDto, RestaurantCreateDto, DishUpdateDto} from "../../app/dto";
import {RestaurantService} from "../../app/restaurant.service";
import {DishSetActiveDto} from "../../app/dto/dishSetActive.dto";

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
    @ApiOperation({summary: 'Registra un restaurante'})
    @ApiResponse({status: 200, description: 'Retorna un restaurante'})
    @ApiResponse({status: 400, description: 'Alguno de los parametros enviados en el body son incorrectos'})
    @ApiResponse({status: 500, description: 'Error en el servidor'})
    create(@Body() body: RestaurantCreateDto) {
        return this.restaurantService.create(body)
    }

    @Post('/dish/create')
    @ApiBody({
        type: DishCreateDto,
    })
    @ApiOperation({summary: 'Registra un plato'})
    @ApiResponse({status: 200, description: 'Retorna un plato'})
    @ApiResponse({status: 400, description: 'Alguno de los parametros enviados en el body son incorrectos'})
    @ApiResponse({status: 500, description: 'Error en el servidor'})
    dishCreate(@Body() body: DishCreateDto) {
        return this.restaurantService.createDish(body)
    }


    @Patch('/dish/update/:id')
    @ApiBody({
        type: DishUpdateDto,
    })
    @ApiOperation({summary: 'Actualiza un plato'})
    @ApiResponse({status: 200, description: 'Retorna un plato'})
    @ApiResponse({status: 400, description: 'Alguno de los parametros enviados en el body son incorrectos'})
    @ApiResponse({status: 500, description: 'Error en el servidor'})
    dishUpdate(@Param('id', ParseIntPipe) id: number, @Body() body: DishUpdateDto) {
        return this.restaurantService.updateDish(id, body)
    }


    @Patch('/dish/set-active/:id')
    @ApiBody({
        type: DishSetActiveDto,
    })
    @ApiOperation({summary: 'Actualiza el estado de un plato'})
    @ApiResponse({status: 200, description: 'Retorna un plato'})
    @ApiResponse({status: 400, description: 'Alguno de los parametros enviados en el body son incorrectos'})
    @ApiResponse({status: 500, description: 'Error en el servidor'})
    setActiveDish(@Param('id', ParseIntPipe) id: number, @Body() body: DishSetActiveDto) {
        return this.restaurantService.updateDish(id, body)
    }

}
