export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const randomString = (len?: number) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = len || 32;
  let key = "";
  for (let i = 0; i < length; i++) {
    key += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return key;
};
