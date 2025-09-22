export const getLastNameChar = (str) =>
  str.trim().split(" ").pop().charAt(0).toUpperCase();
export const setError = (error) =>
  JSON.stringify(error?.response?.data || error?.message) ||
  "An error occurred";
