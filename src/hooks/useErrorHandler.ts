import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

interface ApiErrorData {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
  [key: string]: any; // Permite propiedades adicionales
}

interface ApiError {
  response?: {
    status: number;
    data: ApiErrorData;
  };
  request?: any;
  message?: string;
}

interface ErrorConfig {
  showToast?: boolean;
  customMessages?: Record<number, string>;
  onError?: (error: ApiError) => void;
  redirectOn?: number[];
}

// Type guard para verificar si es un error de Axios
const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError).isAxiosError === true;
};

// Type guard para verificar si es un ApiError
const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('response' in error || 'request' in error || 'message' in error)
  );
};

// Función para convertir data desconocida a ApiErrorData
const parseErrorData = (data: unknown): ApiErrorData => {
  if (typeof data === 'object' && data !== null) {
    return data as ApiErrorData;
  }
  if (typeof data === 'string') {
    return { detail: data };
  }
  return { detail: 'Error desconocido' };
};

export const useApiError = () => {
  const { toast } = useToast();
  const router = useRouter();

  const handleError = (error: unknown, config: ErrorConfig = {}) => {
    const {
      showToast = true,
      customMessages = {},
      onError,
      redirectOn = []
    } = config;

    console.error('API Error:', error);

    // Convertir error desconocido a ApiError
    let apiError: ApiError;

    if (isAxiosError(error)) {
      apiError = {
        response: error.response ? {
          status: error.response.status,
          data: parseErrorData(error.response.data)
        } : undefined,
        request: error.request,
        message: error.message
      };
    } else if (isApiError(error)) {
      apiError = error;
    } else if (error instanceof Error) {
      apiError = {
        message: error.message
      };
    } else {
      apiError = {
        message: 'Error desconocido'
      };
    }

    // Ejecutar callback personalizado si existe
    if (onError) {
      onError(apiError);
    }

    if (!apiError.response) {
      if (showToast) {
        toast({
          variant: "destructive",
          title: "Error de conexión",
          description: "No se pudo conectar con el servidor. Verifica tu conexión.",
        });
      }
      return;
    }

    const status = apiError.response.status;
    const errorData = apiError.response.data;

    // Redireccionar si es necesario
    if (redirectOn.includes(status)) {
      router.push(`/error/${status}`);
      return;
    }

    // Usar mensaje personalizado si existe
    if (customMessages[status]) {
      if (showToast) {
        toast({
          variant: "destructive",
          title: "Error",
          description: customMessages[status],
        });
      }
      return;
    }

    // Mensajes por defecto
    const getDefaultMessage = (status: number, errorData: ApiErrorData) => {
      switch (status) {
        case 400:
          return {
            title: "Datos inválidos",
            description: errorData.detail || errorData.message || "Los datos proporcionados no son válidos."
          };
        case 404:
          return {
            title: "No encontrado",
            description: "El recurso solicitado no fue encontrado."
          };
        case 409:
          return {
            title: "Conflicto",
            description: errorData.detail || errorData.message || "Ya existe un registro con esos datos."
          };
        case 422:
          if (errorData.errors) {
            const fieldErrors = Object.entries(errorData.errors)
              .map(([field, errors]: [string, string[]]) => `${field}: ${errors.join(', ')}`)
              .join('\n');
            return {
              title: "Error de validación",
              description: fieldErrors
            };
          }
          return {
            title: "Error de validación",
            description: errorData.detail || errorData.message || "Algunos campos no son válidos."
          };
        case 500:
          return {
            title: "Error del servidor",
            description: "Error interno del servidor. Intenta más tarde."
          };
        default:
          return {
            title: "Error",
            description: errorData.detail || errorData.message || "Ocurrió un error inesperado."
          };
      }
    };

    if (showToast) {
      const message = getDefaultMessage(status, errorData);
      toast({
        variant: "destructive",
        title: message.title,
        description: message.description,
      });
    }
  };

  return { handleError };
};