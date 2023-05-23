import {Injectable} from '@nestjs/common';
import {UserRepository} from "../infra/repositories/user.repository";
import {RoleRepository} from "../infra/repositories/role.repository";

@Injectable()
export class UsersService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly rolesRepository: RoleRepository,
    ) {
    }

    async findUserByEmail(email: string): Promise<any> {

        //todo peticion con axios al microservicio de usuarios

    }

    async findOneById(id: number): Promise<any> {
        //todo peticion con axios al microservicio de usuarios
    }

    async findRoleByName(name: string) {
        //todo peticion con axios al microservicio de usuarios
    }

}
