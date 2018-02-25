declare module "*.schema.json" {
  import { ValidateFunction } from 'ajv';
  const value: ValidateFunction;
  export default value;
}
