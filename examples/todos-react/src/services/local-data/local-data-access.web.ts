export const DataAccess: import('./local-data-access').DataAccess = {
  setItem: (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
  getItem: (key: string) => Promise.resolve(localStorage.getItem(key))
}
