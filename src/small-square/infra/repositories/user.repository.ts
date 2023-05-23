import {DataSource, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UserRepository extends Repository<any> {

    async findUserByEmail(email: string): Promise<any> {

    }

    async findById(id: number): Promise<any> {

    }

}