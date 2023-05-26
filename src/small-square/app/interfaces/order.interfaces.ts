export interface OrderInterfaces {
    id_plato: number,
    cantidad: number
}

export enum estados {
    PEN = "pendiente",
    FIN = "finalizado",
    PREP = "preparacion",
}