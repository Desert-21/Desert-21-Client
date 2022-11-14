export const underscoreToRegular = (s: string) => {
  const arr = s.split('_');
  return arr
    .map(
      (str) =>
        str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase()
    )
    .reduce((prev, next) => prev + ' ' + next, '')
    .trim();
};

export const underscoreToUpperCamelCase = (s: string) => {
  const arr = s.split('_');
  return arr
    .map(
      (str) =>
        str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase()
    )
    .reduce((prev, next) => prev + next, '')
    .trim();
};

export const underscoreToLowerCamelCase = (s: string) => {
  const arr = s.split('_');
  return arr
    .map(
      (str) =>
        str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase()
    )
    .reduce((prev, next, index) => {
      if (index === 1) {
        prev = prev.toLowerCase();
      }
      return prev + next;
    }, '')
    .trim();
};

export const capitalize = (s: string) => {
  return s.substring(0, 1).toUpperCase() + s.substring(1);
};

export const underscoreToKebabCase = (s: string) => {
  return s.toLowerCase().replace(/_/g, '-');
};

export const camelCaseToCapsLock = (s: string) => {
  return s
    .replace(/\.?([A-Z])/g, (x, y) => '_' + y.toLowerCase())
    .replace(/^_/, '')
    .replace('_', ' ')
    .toUpperCase();
};

export const camelCaseToKebabCase = (s: string) =>
  underscoreToKebabCase(camelCaseToCapsLock(s).replace(/ /, '-'));
