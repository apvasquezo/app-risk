export const transformChannels = (data: any[]) => {
    return data.map((ch) => ({
      id: ch.id_channel,
      name: ch.description,
    }));
  };
  
  export const transformCategories = (data: any[]) => {
    return data.map((cat) => ({
      id_category: cat.id_category,
      name: cat.description,
    }));
  };
  
  export const transformCauses = (data: any[]) => {
    return data.map((cause) => ({
      id: cause.id_cause,
      description: cause.description,
    }));
  };
  
  export const transformConsequences = (data: any[]) => {
    return data.map((conseq) => ({
      id: conseq.id_consequence,
      description: conseq.description,
    }));
  };

  export const transformControls = (data: any[]) => {
    return data.map((ctrl) => ({
      id: ctrl.id_control,
      tipoControl: ctrl.tipo_control,
      descripcion: ctrl.descripcion,
      frecuencia: ctrl.frecuencia,
      responsable: ctrl.responsable,
    }));
  };