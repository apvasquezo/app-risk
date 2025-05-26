// Interfaces backend (datos crudos)
export interface Channel {
  id_channel: number;
  description: string;
}

export interface Category {
  id_category: number;
  description: string;
}

export interface Cause {
  id_cause: number;
  description: string;
}

export interface Consequence {
  id_consequence: number;
  description: string;
}

export interface Control {
  id_control: number;
  tipo_control: string;
  descripcion: string;
  frecuencia: string;
  responsable: string;
}

export interface Employee {
  id_employee: number;
  cedula: string;
  nombre: string;
  cargo: string;
  area: string;
  correo: string;
}

export interface RiskFactor {
  id_factor: number;
  tipo: string;
  descripcion: string;
}

export interface TypeControl {
  id_typecontrol: number;
  description: string;
}

export interface RawUser {
  id_user: string;
  username: string;
  role_id: number;
}

// Interface frontend (ya transformado)
export interface User {
  id: string;
  usuario: string;
  contraseña: string;
  rol: string;
}

// Transformadores
export const transformChannels = (data: Channel[]) => {
  return data.map((ch) => ({
    id: String(ch.id_channel),
    name: ch.description,
  }));
};

export const transformCategories = (data: Category[]) => {
  return data.map((cat) => ({
    id_category: String(cat.id_category),
    name: cat.description,
  }));
};

export const transformCauses = (data: Cause[]) => {
  return data.map((cause) => ({
    id: cause.id_cause,
    description: cause.description,
  }));
};

export const transformConsequences = (data: Consequence[]) => {
  return data.map((conseq) => ({
    id: conseq.id_consequence,
    description: conseq.description,
  }));
};

export const transformControls = (data: Control[]) => {
  return data.map((ctrl) => ({
    id: ctrl.id_control,
    tipoControl: ctrl.tipo_control,
    descripcion: ctrl.descripcion,
    frecuencia: ctrl.frecuencia,
    responsable: ctrl.responsable,
  }));
};

export const transformEmployees = (data: Employee[]) => {
  return data.map((emp) => ({
    id: emp.id_employee,
    cedula: emp.cedula,
    name: emp.nombre,
    cargo: emp.cargo,
    area: emp.area,
    correo: emp.correo,
  }));
};

export const transformRiskFactors = (data: RiskFactor[]) => {
  return data.map((factor) => ({
    id: String(factor.id_factor),
    type: factor.tipo,
    description: factor.descripcion,
  }));
};

export const transformTypeControl = (data: TypeControl[]) => {
  return data.map((typecontrol) => ({
    id: typecontrol.id_typecontrol,
    description: typecontrol.description,
  }));
};

export const transformUsers = (data: RawUser[]): User[] => {
  return data.map((user) => ({
    id: user.id_user,
    usuario: user.username,
    contraseña: "",
    rol: user.role_id === 1 ? "super" : "admin",
  }));
};
