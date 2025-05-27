// Interfaces backend (datos crudos)
export interface Channel {
  id_channel: number;
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


export interface TypeControl {
  id_typecontrol: number;
  description: string;
}

export interface RawUser {
  id_user:string,
  username: string;
  role_id: number;
}

export interface User {
  id: string;
  usuario: string;
  contraseña: string;
  rol: string;
}

interface RawEmployee {
  id_personal: string
  name: string
  position: string
  area: string
  email: string
  notify: boolean
}

export interface Employee {
  cedula: string
  name: string
  cargo: string
  area: string
  correo: string
  notifica: boolean
}


// Transformadores
export const transformChannels = (data: Channel[]) => {
  return data.map((ch) => ({
    id: String(ch.id_channel),
    name: ch.description,
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

export const transformEmployees = (data: RawEmployee[]) => {
  return data.map((emp) => ({
    cedula: emp.id_personal,
    name: emp.name,
    cargo: emp.position,
    area: emp.area,
    correo: emp.email,
    notifica:emp.notify
  }));
};

export interface RiskFactor {
  id_factor: number
  risk_type_id: number
  description: string
}
export const transformRiskFactors = (data: RiskFactor[]) => {
  return data.map((factor) => ({
    id: factor.id_factor.toString(),
    type_id: factor.risk_type_id.toString(),
    type: "", 
    description: factor.description,
  }))
}

export interface TypeControl {
  id_controltype: number
  description: string
}

export const transformTypeControl = (data: TypeControl[]) => {
  return data.map((typecontrol) => ({
    id: typecontrol.id_controltype, 
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

export interface TypeRisk {
  id_risktype: number
  category_id: number
  description: string
}

export const transformTypeRisk = (data: TypeRisk[]) => {
  return data.map((typerisk) => ({
    id_risk: typerisk.id_risktype.toString(), 
    category_id: typerisk.category_id.toString(), 
    category: "",
    description: typerisk.description,
  }))
}

export interface RawCategory {
  id_riskcategory: number
  description: string
}

export const transformCategory = (data: RawCategory[]) => {
  return data.map((categories) => ({
    id_category: categories.id_riskcategory.toString(), // Convertir a string para consistencia
    name: categories.description,
  }))
}

export interface Probability {
  level: number
  description: string
  definition: string
  criteria_por: number
}

export const transformProbability = (data: Probability[]) => {
  return data.map((prob) => ({
    level: prob.level,
    description: prob.description,
    definition: prob.definition,
    criteria_por: prob.criteria_por
  }));
};

export interface Impact {
  level: number
  description: string
  definition: string
  criteria_smlv: number
}

export const transformImpact = (data: Impact[]) => {
  return data.map((impact) => ({
    level: impact.level,
    description: impact.description,
    definition: impact.definition,
    criteria_smlv: impact.criteria_smlv,
  }))
}