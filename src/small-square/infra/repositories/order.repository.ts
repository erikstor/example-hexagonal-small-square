import {DataSource, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {PedidosEntity} from "../../domain/entities";

@Injectable()
export class OrderRepository extends Repository<PedidosEntity> {

    constructor(public readonly dataSource: DataSource) {
        super(PedidosEntity, dataSource.createEntityManager());
    }

}