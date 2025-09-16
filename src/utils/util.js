export const getLastNameChar = (str) =>
  str.trim().split(" ").pop().charAt(0).toUpperCase();
