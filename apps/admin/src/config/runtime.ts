// VITE_USE_MOCKS ayarlanmadıysa varsayılan olarak mock'ları aktif et
const envValue = (import.meta as any).env?.VITE_USE_MOCKS;
export const USE_MOCKS: boolean =
  envValue === undefined
    ? true
    : String(envValue).toLowerCase() === 'true';


