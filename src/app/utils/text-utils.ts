export const underscoreToRegular = (s: string) => {
  const arr = s.split('_');
  return arr.map(str =>
    str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase()
  ).reduce((prev, next) => prev + ' ' + next, '')
  .trim();
};
