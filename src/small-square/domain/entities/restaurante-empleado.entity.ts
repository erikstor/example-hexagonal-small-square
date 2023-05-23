import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm"
import {UsuariosEntity} from "./usuarios.entity";
import {PedidosEntity} from "./pedidos.entity";

@Entity({
    name: 'restaurante_empleado'
})
export class RestauranteEmpleadoEntity {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn('bigint')
    id!: number

    @Column('varchar')
    nombre!: string

    @Column('varchar')
    apellido!: string

    @Column('varchar')
    celular!: string

    @Column('varchar', {
        unique: true,
    })
    correo!: string

    @Column('varchar')
    clave!: string

    @Column('bigint')
    usuario!: UsuariosEntity

    @OneToOne(
        () => PedidosEntity,
        pedidos => pedidos.chef,
    )
    @JoinColumn()
    restaurante!: PedidosEntity
}