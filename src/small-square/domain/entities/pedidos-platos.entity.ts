import {Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm"
import {PlatosEntity} from "./platos.entity";
import {PedidosEntity} from "./pedidos.entity";


@Entity({
    name: 'pedidos_platos'
})
export class PedidosPlatosEntity {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn('bigint')
    id!: number

    @Column('int')
    cantidad!: number

    @ManyToOne(
        () => PlatosEntity,
        (platos) => platos.id,
    )
    platos!: PlatosEntity | number

    @ManyToOne(
        () => PedidosEntity,
        (pedido) => pedido.id,
    )
    pedido!: PlatosEntity | number

}
