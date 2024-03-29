import * as zod from 'zod';

// this is the recommended why for checking a zod schema in sync with referencing type
// reference: https://github.com/colinhacks/zod/issues/372#issuecomment-826380330
const schemaForType =
  <T>() =>
  // disabling the using of any of using any in the recommended approach for making sure a zod schema match a
  // typescript type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <S extends zod.ZodType<T, any, any>>(arg: S) => {
    return arg;
  };

const getErrorPaths = <TSchemaData>(zodError: zod.ZodError) => {
  const keys: TSchemaData[] = [];

  zodError.issues.forEach((issue) => {
    keys.push(issue.path.join('.') as TSchemaData);
  });

  return [...new Set(keys)];
};

export const zodUtils = {
  schemaForType,
  getErrorPaths,
};
