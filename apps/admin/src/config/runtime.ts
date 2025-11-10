// VITE_USE_MOCKS ayarlanmadıysa dev ortamında varsayılan olarak true kabul et
const envValue = (import.meta as any).env?.VITE_USE_MOCKS;
export const USE_MOCKS: boolean = envValue === undefined
  ? true
  : String(envValue).toLowerCase() === 'true';


