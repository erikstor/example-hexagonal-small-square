import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm"
import {RestaurantesEntity} from "./restaurantes.entity";
import {RestauranteEmpleadoEntity} from "./restaurante-empleado.entity";

enum estados {
    PEN = "pendiente",
    FIN = "finalizado",
    PREP = "preparacion",
}

@Entity({
    name: 'pedidos'
})
export class PedidosEntity {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn('bigint')
    id!: number

    @Column('date')
    fecha!: string


    @Column({type: 'enum', enum: estados, default: estados.PEN})
    estado!: estados

    @Column('varchar')
    descripcion!: string

    @Column('bigint')
    id_cliente!: number

    @OneToOne(() => RestaurantesEntity)
    @JoinColumn()
    restaurante!: RestaurantesEntity

    @OneToOne(() => RestauranteEmpleadoEntity)
    @JoinColumn()
    chef!: RestauranteEmpleadoEntity

}