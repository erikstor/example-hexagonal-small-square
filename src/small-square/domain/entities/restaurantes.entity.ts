import {Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm"
import {PlatosEntity} from "./platos.entity";

@Entity({
    name: 'restaurantes'
})
export class RestaurantesEntity {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn('bigint')
    id!: number

    @Column('varchar')
    nombre!: string

    @Column('text')
    direccion!: string

    @Column('varchar')
    telefono!: string

    @Column('text')
    url_logo!: string

    @Column('varchar')
    nit!: string

    @Column('varchar')
    id_propietario!: number

    @OneToMany(
        () => PlatosEntity,
        platos => platos.id,
        {
            eager: false
        })
    platos!: PlatosEntity | undefined
}