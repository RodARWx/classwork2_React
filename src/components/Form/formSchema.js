import { z } from 'zod';

export const ROLE_OPTIONS = [
  { value: 'frontend', label: 'Desarrollador Frontend' },
  { value: 'backend', label: 'Desarrollador Backend' },
  { value: 'fullstack', label: 'Desarrollador Full Stack' },
  { value: 'uiux', label: 'Diseñador UI / UX' },
];

export const EXPERIENCE_OPTIONS = [
  { value: 'junior', label: 'Junior (0 - 1 año)' },
  { value: 'mid', label: 'Semi-Senior (2 - 4 años)' },
  { value: 'senior', label: 'Senior (5+ años)' },
];

export const SKILL_OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'css', label: 'CSS / Animaciones' },
];

export const formSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(60, 'El nombre no puede superar los 60 caracteres'),
  email: z
    .string()
    .trim()
    .min(1, 'El correo es obligatorio')
    .email('Ingresa un correo electrónico válido'),
  phone: z
    .string()
    .trim()
    .regex(/^\d{7,15}$/, 'El teléfono debe tener entre 7 y 15 dígitos numéricos'),
  age: z.coerce
    .number({ invalid_type_error: 'La edad debe ser un número' })
    .int('La edad debe ser un número entero')
    .min(18, 'Debes ser mayor de 18 años')
    .max(99, 'Ingresa una edad válida (máx. 99)'),
  role: z.enum(['frontend', 'backend', 'fullstack', 'uiux'], {
    errorMap: () => ({ message: 'Selecciona un rol de la lista' }),
  }),
  experience: z.enum(['junior', 'mid', 'senior'], {
    errorMap: () => ({ message: 'Selecciona tu nivel de experiencia' }),
  }),
  skills: z
    .array(z.string())
    .min(1, 'Selecciona al menos una habilidad técnica'),
  comments: z
    .string()
    .trim()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(300, 'El mensaje no puede exceder los 300 caracteres'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Debes aceptar los términos antes de enviar' }),
  }),
});

export const INITIAL_FORM_VALUES = {
  fullName: '',
  email: '',
  phone: '',
  age: '',
  role: '',
  experience: '',
  skills: [],
  comments: '',
  acceptTerms: false,
};
