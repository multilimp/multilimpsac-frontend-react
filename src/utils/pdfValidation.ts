export interface PdfValidationResult {
  isValid: boolean;
  message: string;
  errors: string[];
}

export interface PdfValidationOptions {
  maxSizeMB?: number;
  requiredPrefix?: string;
  allowedExtensions?: string[];
}

export const validatePdfFile = (
  file: File, 
  options: PdfValidationOptions = {}
): PdfValidationResult => {
  const {
    maxSizeMB = 10,
    requiredPrefix = 'OCAM',
    allowedExtensions = ['pdf']
  } = options;

  const errors: string[] = [];

  // Validar que sea PDF
  if (file.type !== 'application/pdf') {
    errors.push('El archivo debe ser un PDF');
  }

  // Validar extensión del archivo
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!allowedExtensions.includes(fileExtension || '')) {
    errors.push(`Solo se permiten archivos: ${allowedExtensions.join(', ')}`);
  }

  // Validar que el nombre comience con el prefijo requerido
  if (requiredPrefix && !file.name.toUpperCase().startsWith(requiredPrefix.toUpperCase())) {
    errors.push(`El archivo debe comenzar con "${requiredPrefix}"`);
  }

  // Validar tamaño del archivo
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    errors.push(`El archivo no puede superar ${maxSizeMB}MB (actual: ${fileSizeMB.toFixed(2)}MB)`);
  }

  // Validar que el archivo no esté vacío
  if (file.size === 0) {
    errors.push('El archivo no puede estar vacío');
  }

  const isValid = errors.length === 0;
  const message = isValid 
    ? 'Archivo válido' 
    : errors.length === 1 
      ? errors[0] 
      : `Múltiples errores: ${errors.join(', ')}`;

  return {
    isValid,
    message,
    errors
  };
};

export const validateOcamPdf = (file: File): PdfValidationResult => {
  return validatePdfFile(file, {
    requiredPrefix: 'OCAM',
    maxSizeMB: 10,
    allowedExtensions: ['pdf']
  });
};

export const validateGenericPdf = (file: File, maxSizeMB = 10): PdfValidationResult => {
  return validatePdfFile(file, {
    maxSizeMB,
    allowedExtensions: ['pdf']
  });
};

export const getFileInfo = (file: File) => {
  return {
    name: file.name,
    size: file.size,
    sizeMB: (file.size / (1024 * 1024)).toFixed(2),
    type: file.type,
    lastModified: new Date(file.lastModified),
    extension: file.name.split('.').pop()?.toLowerCase()
  };
}; 