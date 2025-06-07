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
    id_control: ctrl.id_control.toString(),
    control_type_id: ctrl.control_type_id.toString(),
    description: ctrl.description,
    frequency: ctrl.frequency,
    responsible_id: ctrl.responsible_id,
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
  star_date : string,
  end_date : string,
  personal_id : string,
  state:string, 
  control_id:number,
  control_name:string
}

export const transformPlans = (data: ActionPlan[]) => {
  return data.map(item => ({
    id_plan: item.id_plan.toString(),
    control_id: item.control_id.toString(),
    control_name: item.control_name,
    descripcion: item.description ,
    fechaInicial: item.star_date,
    fechaFinal: item.end_date,  
    responsable: item.personal_id,
    estado: item.state,
  }));
};

export interface Event {
  id_event: number
  risk_type_id: number
  factor_id: number
  description: string
  probability_id: number
  impact_id: number
}

export const transformEvent = ( data: Event[]) => {
  return data.map(item =>({
    id: item.id_event.toString(),
    t_riesgo: item.risk_type_id.toString(),
    factor_id: item.factor_id.toString(),
    description: item.description,
    probabilidad: item.probability_id.toString(),
    impacto: item.impact_id.toString(),
  }))
}

export interface Event_log {
  id_eventlog: number
  event_id: number
  description: string
  start_date: string
  end_date: string
  discovery_date: string
  accounting_date: string
  amount: number
  recovered_amount: number
  insurance_recovery: number
  acount: number
  product_id: number
  process_id: number
  channel_id: number
  city: string
  responsible_id: string
  status: string
  cause1_id: number
  cause2_id: number
  conse1_id: number
  conse2_id: number
}

export const transformEventLog = (data: Event_log[]) => {
  return data.map(item => ({
    id: item.id_eventlog?.toString() ?? "",
    eventId: item.event_id?.toString() ?? "",
    fechaInicio: item.start_date ?? "",
    fechaFinal: item.end_date ?? "",
    fechaDescubrimiento: item.discovery_date ?? "",
    fechaContabilizacion: item.accounting_date ?? "",
    cuantia: item.amount?.toString() ?? "",
    cuantiaRecuperada: item.recovered_amount?.toString() ?? "",
    cuantiaRecuperadaSeguros: item.insurance_recovery?.toString() ?? "",
    factorRiesgo: "",
    cuentaContable: item.acount?.toString() ?? "",
    productoServicio: item.product_id?.toString() ?? "",
    proceso: item.process_id?.toString() ?? "",
    descripcion: item.description ?? "",
    canal: item.channel_id?.toString() ?? "",
    ciudad: item.city ?? "",
    responsable: item.responsible_id ?? "",
    estado: item.status ?? "",
    causa1: item.cause1_id?.toString() ?? "",
    causa2: item.cause2_id?.toString() ?? "",
    consecuencia1: item.conse1_id?.toString() ?? "",
    consecuencia2: item.conse2_id?.toString() ?? "",
  }));
};


export interface Services {
  id_product: number
  description: string
}

export const transformService = (data: Services[]) => {
  return data.map((item) => ({
    id: item.id_product.toString(),
    name: item.description,
  }));
};

export interface EvalControl {
  id_evaluation: number
  eventlog_id: number
  control_id: number
  eval_date: string
  n_probability: number
  n_impact: number
  next_date: string
  description: string
  observation: string
  state_control: string
  state_evaluation: string
  control_efficiency: number
  created_by: string     
}

export const transformEvaluation = (data: EvalControl[]) => {
  const efectividadInverseMap: Record<number, string> = {
    0.2: "Critica 0% - 20%",
    0.5: "Baja 21% - 50%",
    0.8: "Media 51% - 80%",
    1.0: "Alta 81% - 100%",
  }

  return data.map((item) => ({
    id: item.id_evaluation.toString(),
    idControl: item.control_id.toString(),
    idEvento: item.eventlog_id.toString(),
    fechaEvaluacion: item.eval_date ?? "",
    nivelProbabilidad: item.n_probability.toString(),
    nivelImpacto: item.n_impact.toString(),
    fechaProximaEvaluacion: item.next_date ?? "",
    descripcion: item.description,
    observacion: item.observation,
    efectividadControl: efectividadInverseMap[item.control_efficiency] || item.control_efficiency.toString(),
    estadoControl: item.state_control,
    estadoEvaluacion: item.state_evaluation,
    usuario: item.created_by,
  }))
}
export interface EventLog {
  id_eventlog: string
  description: string
}

export const transformRisk = (data:EventLog []) => {
  return data.map((item) => ({
    id: item.id_eventlog.toString(),
    name: item.description,
  }));
}
