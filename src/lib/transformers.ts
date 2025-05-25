interface Channel {
  id_channel: number;
  description: string;
}

interface Category {
  id_category: number;
  description: string;
}

interface Cause {
  id_cause: number;
  description: string;
}

interface Consequence {
  id_consequence: number;
  description: string;
}

interface Control {
  id_control: number;
  tipo_control: string;
  descripcion: string;
  frecuencia: string;
  responsable: string;
}

interface Employee {
  id_employee: number;
  cedula: string;
  nombre: string;
  cargo: string;
  area: string;
  correo: string;
}

interface RiskFactor {
  id_factor: number;
  tipo: string;
  descripcion: string;
}

interface TypeControl {
  id_typecontrol: number;
  description: string;
}


export const transformChannels = (data: Channel[]) => {
  return data.map((ch) => ({
    id: String(ch.id_channel),
    name: ch.description,
  }));
};

export const transformCategories = (data: Category[]) => {
  return data.map((cat) => ({
    id_category: cat.id_category,
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

