import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RestaurantesEntity } from './restaurantes.entity';
import { RestauranteEmpleadoEntity } from './restaurante-empleado.entity';
import { UsuariosEntity } from './usuarios.entity';
import { estados } from '../../app/interfaces/order.interfaces';
import { PedidosPlatosEntity } from './pedidos-platos.entity';
import { randomInt } from 'crypto';

@Entity({
  name: 'pedidos',
})
export class PedidosEntity {
  @PrimaryGeneratedColumn('increment')
  @PrimaryColumn('bigint')
  id?: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha!: Date;

  @Column({
    type: 'enum',
    enum: estados,
    default: estados.PEN,
  })
  estado!: estados;

  @Column('varchar')
  descripcion!: string;

  @Column('int', { default: randomInt(9999) })
  codigo!: number;

  @Column()
  @ManyToOne(() => UsuariosEntity, (user) => user.id, {
    eager: true,
  })
  @JoinColumn({ name: 'id_cliente' })
  id_cliente: UsuariosEntity | number;

  @Column()
  @ManyToOne(() => RestaurantesEntity, (restaurant) => restaurant.id)
  @JoinColumn({ name: 'id_restaurante' })
  id_restaurante!: RestaurantesEntity | number;

  @Column({ nullable: true })
  @ManyToOne(() => RestauranteEmpleadoEntity)
  @JoinColumn({ name: 'id_chef' })
  id_chef?: RestauranteEmpleadoEntity | number;

  @OneToMany(() => PedidosPlatosEntity, (pp) => pp.pedido)
  pedidos_platos!: PedidosPlatosEntity | undefined;
}
