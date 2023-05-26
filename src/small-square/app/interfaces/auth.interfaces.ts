export interface TokenUser {
    id:       number;
    nombre:   string;
    apellido: string;
    celular:  string;
    dni:      number;
    correo:   string;
    clave:    string;
    role:     Role;
    iat:      number;
    exp:      number;
}

export interface Role {
    id:          number;
    nombre:      string;
    descripcion: string;
}
