export const setLocalStorage = (key: string, data: unknown): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getLocalStorage = (key: string): unknown => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const clearLocalStorage = (): void => {
  localStorage.clear();
};

export const removeFieldLocalStorage = (keyItem: string): void => {
  localStorage.removeItem(keyItem);
};
