export const cprChecksumTest = (tin: string): boolean => {
  if (tin.length !== 11) {
    return false;
  }

  const cprRegex = /^(\d{2})(\d{2})(\d{2})-\d{4}$/;
  const match = tin.match(cprRegex);
  if (!match) {
    return false;
  }

  const day = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const year = Number.parseInt(match[3], 10);

  if (day < 1 || day > 31 || month < 1 || month > 12) {
    return false;
  }

  tin = tin.replace("-", "");
  const weights = [4, 3, 2, 7, 6, 5, 4, 3, 2, 1];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(tin.charAt(i), 10) * weights[i];
  }

  return sum % 11 === 0;
};
