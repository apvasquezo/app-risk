
export interface Channel {
  id_channel: number;
  description: string;
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

export interface Cause {
  id_cause: number;
  description: string;
}

export interface Consequence {
  id_consequence: number;
  description: string;
}


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
export interface Control {
  id_control: number;
  control_type_id: number  
  description: string
  frequency: string
  responsible_id: string
}

export const transformControls = (data: Control[]) => {
  return data.map((ctrl) => ({
    id: ctrl.id_control.toString(),
    tipoControl: ctrl.control_type_id.toString(),
    descripcion: ctrl.description,
    control:"",
    frecuencia: ctrl.frequency,
    responsable: ctrl.responsible_id,
  }));
};

export const transformControlPlan = (data: Control[]) => {
  return data.map((ctrl) => ({
    id: ctrl.id_control.toString(),
    descripcion: ctrl.description,
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

export interface RawProces {
  id_process: number
  macroprocess_id: number
  description: string
  personal_id: string
}
export const transformProces = (data : RawProces[]) => {
  return data.map((proces) => ({
    id: proces.id_process.toString(),
    macroprocess_id: proces.macroprocess_id.toString(),
    macro:"",
    description: proces.description,
    personal_id:proces.personal_id,
  }))
}

export interface Macro {
  id_macro: number,
  description:string
}

export const transformMacro= (data: Macro[]) => {
  return data.map((macro) => ({
    id_macro: macro.id_macro, 
    description: macro.description,
  }))
}

export interface ActionPlan {
  id_plan : number,
  description:string,
  star_date : Date,
  end_date : Date,
  personal_id : string,
  state:string, 
}

export const transformPlans = (data: ActionPlan[]) => {
  return data.map(item => ({
    id_plan: item.id_plan.toString(),
    control_id: "", // control_id 
    control: "", // nombre del control
    descripcion: item.description ,
    fechaInicial: item.star_date.toISOString(),
    fechaFinal: item.end_date.toISOString(),  
    responsable: item.personal_id,
    estado: item.state,
  }));
};