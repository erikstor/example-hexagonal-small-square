export interface OrderInterfaces {
    id_plato: number,
    cantidad: number
}

export enum estados {
    PEN = "pendiente",
    DELIBERY = "entregado",
    PREP = "preparacion",
    READY = "listo",
    CANCEL = "cancelado",
}