const pascalToKabob = (value: string) => {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
};

const isPascalCase = (value: string): boolean => {
  return /^([A-Z][a-z]+)+$/.test(value);
};

export const stringUtils = {
  pascalToKabob,
  isPascalCase,
};
