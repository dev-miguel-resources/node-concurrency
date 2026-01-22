import { Request } from 'express';
import { ObjectSchema } from 'joi';
import { JoiRequestValidationError } from '../helpers/errors/joiValidateError';

type JoiDecorator = (target: unknown, key: string, descriptor: PropertyDescriptor) => void;

// Decorador para manejar todas las validaciones de los dtos que deban revisarse por los servicios rest
// del controlador
export function joiValidation(schema: ObjectSchema): JoiDecorator {
  return (_target: unknown, _key: string, descriptor: PropertyDescriptor) => {
    // Identificar el método -> ruta
    const originalMethod = descriptor.value;

    // gestionar el array de properties del request
    descriptor.value = async function (...args: [Request]) {
      const req: Request = args[0];
      const { error } = await Promise.resolve(schema.validate(req.body));
      if (error?.details) {
        throw new JoiRequestValidationError(error.details[0].message); // para controlar el error en base a las reglas de los schemas
      }
      return originalMethod.apply(this, args); // ejecución normal de la lógica de la ruta
    };
    return descriptor; // devolvemos la metadata resultante
  };
}
