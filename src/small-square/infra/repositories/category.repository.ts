import {DataSource, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {CategoriaEntity} from "../../domain/entities";

@Injectable()
export class CategoryRepository extends Repository<CategoriaEntity> {

    constructor(public readonly dataSource: DataSource) {
        super(CategoriaEntity, dataSource.createEntityManager());
    }

}