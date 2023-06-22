import * as Yup from 'yup';

const POSSIBLE_OPERATIONS = ['addition', 'subtraction', 'multiplication', 'division', 'square_root', 'random_string'];

export const operateSchema = Yup.object({
  operation: Yup.string().oneOf(POSSIBLE_OPERATIONS).required(),
  a: Yup.number(),
  b: Yup.number()
});
