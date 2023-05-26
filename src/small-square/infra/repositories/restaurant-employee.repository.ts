import {DataSource, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {RestauranteEmpleadoEntity} from "../../domain/entities";

@Injectable()
export class RestaurantEmployeeRepository extends Repository<RestauranteEmpleadoEntity> {

    constructor(public readonly dataSource: DataSource) {
        super(RestauranteEmpleadoEntity, dataSource.createEntityManager());
    }

}