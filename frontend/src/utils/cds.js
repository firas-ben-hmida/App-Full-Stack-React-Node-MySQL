export const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const isValidPassword = (password) => {
  return password.length >= 8;
};