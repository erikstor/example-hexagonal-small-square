import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne, OneToMany,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn
} from "typeorm"
import {RestaurantesEntity} from "./restaurantes.entity";
import {RestauranteEmpleadoEntity} from "./restaurante-empleado.entity";
import {UsuariosEntity} from "./usuarios.entity";
import {estados} from "../../app/interfaces/order.interfaces";
import {PedidosPlatosEntity} from "./pedidos-platos.entity";


@Entity({
    name: 'pedidos'
})
export class PedidosEntity {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn('bigint')
    id?: number

    @Column({type: 'date', default: new Date()})
    fecha!: Date


    @Column({type: 'enum', enum: estados, default: estados.PEN})
    estado!: estados

    @Column('varchar')
    descripcion!: string

    @ManyToOne(
        () => UsuariosEntity,
        (user) => user.id,
    )
    @JoinColumn({name: 'id_cliente'})
    id_cliente: UsuariosEntity | number

    @ManyToOne(() => RestaurantesEntity)
    @JoinColumn({name: 'id_restaurante'})
    id_restaurante!: RestaurantesEntity | number

    @ManyToOne(() => RestauranteEmpleadoEntity)
    @JoinColumn({name: 'id_chef'})
    id_chef!: RestauranteEmpleadoEntity | number

    @OneToMany(() => PedidosPlatosEntity, pp => pp.pedido)
    pedidos_platos!: PedidosPlatosEntity

}