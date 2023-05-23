import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm"

import {RolesEntity} from "./roles.entity";

@Entity({
    name: 'usuarios'
})
export class UsuariosEntity {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn('bigint')
    id?: number

    @Column('varchar')
    nombre!: string

    @Column('varchar')
    apellido!: string

    @Column('varchar')
    celular!: string

    @Column('integer')
    dni!: number

    @Column('varchar', {
        unique: true,
    })
    correo!: string

    @Column('varchar')
    clave?: string

    @ManyToOne(
        () => RolesEntity,
        role => role.id,
        {
            eager: true,
            persistence: true,
        })
    role!: RolesEntity | number
}