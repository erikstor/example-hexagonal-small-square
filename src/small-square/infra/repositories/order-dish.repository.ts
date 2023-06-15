import {DataSource, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import { PedidosPlatosEntity} from "../../domain/entities";

@Injectable()
export class OrderDishRepository extends Repository<PedidosPlatosEntity> {

    constructor(public readonly dataSource: DataSource) {
        super(PedidosPlatosEntity, dataSource.createEntityManager());
    }

}