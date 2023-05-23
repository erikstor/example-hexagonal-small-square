import {Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm"

import {PlatosEntity} from "./platos.entity";

@Entity({
    name: 'categoria'
})
export class CategoriaEntity {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn('bigint')
    id!: number

    @Column('varchar')
    nombre!: string

    @Column('varchar')
    descripcion!: string

    @OneToMany(
        () => PlatosEntity,
        (plato) => plato.id,
    )
    plato: PlatosEntity | undefined

}