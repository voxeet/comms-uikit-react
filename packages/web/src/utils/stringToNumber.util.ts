export const stringToNumber = (string?: string) => {
  let value = 0;
  if (string) {
    const cleanString = string.replace(/ /g, '').toLowerCase();

    for (let i = 0; i < cleanString.length; i++) {
      value += cleanString.charCodeAt(i);
    }
  }
  return value;
};
