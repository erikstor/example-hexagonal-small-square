import {Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm"
import {UsuariosEntity} from "./usuarios.entity";
import {RestaurantesEntity} from "./restaurantes.entity";

@Entity({
    name: 'restaurante_empleado'
})
export class RestauranteEmpleadoEntity {

    @PrimaryGeneratedColumn('increment')
    @PrimaryColumn('bigint')
    id!: number

    @ManyToOne(
        () => UsuariosEntity,
        (user) => user.id,
    )
    @JoinColumn({name: 'id_usuario'})
    id_usuario: UsuariosEntity | number


    @ManyToOne(
        () => RestaurantesEntity,
        restaurante => restaurante.id,
    )
    @JoinColumn({name: 'id_restaurante'})
    restaurante!: RestaurantesEntity | number
}