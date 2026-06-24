import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';

export function validator(message: any, schema: any) {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  ajvErrors(ajv); // Apply ajv-errors
  const validate = ajv.compile(schema);

  const valid = validate(message);

  if (valid) {
    return {
      status: true,
    };
  }

  return {
    status: false,
    errorsMessage: validate.errors,
  };
}
