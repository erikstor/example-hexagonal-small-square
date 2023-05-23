import {DataSource, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {RestaurantesEntity} from "../../domain/entities";

@Injectable()
export class RestaurantRepository extends Repository<RestaurantesEntity> {

    constructor(public readonly dataSource: DataSource) {
        super(RestaurantesEntity, dataSource.createEntityManager());
    }

}