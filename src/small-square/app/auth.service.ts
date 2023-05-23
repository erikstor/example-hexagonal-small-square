import {Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";

import {UsersService} from "./users.service";

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {
    }

}
