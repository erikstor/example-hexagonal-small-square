import {DataSource, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {PlatosEntity} from "../../domain/entities";

@Injectable()
export class DishRepository extends Repository<PlatosEntity> {

    constructor(public readonly dataSource: DataSource) {
        super(PlatosEntity, dataSource.createEntityManager());
    }

}