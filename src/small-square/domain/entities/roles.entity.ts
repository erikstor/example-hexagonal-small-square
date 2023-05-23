import {Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm"

import {UsuariosEntity} from "./usuarios.entity";

@Entity({
    name: 'roles'
})
export class RolesEntity {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn('bigint')
    id!: number

    @Column('varchar')
    nombre!: string

    @Column('varchar')
    descripcion!: string

    @OneToMany(
        () => UsuariosEntity,
        (user) => user.id,
    )
    user: UsuariosEntity | undefined

}