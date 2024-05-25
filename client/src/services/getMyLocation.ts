export interface IPInfo {
  ciudad: string;
  latitud: string;
  longitud: string;
  pais: string;
}

export const api_getMyLocation = async () => {
  const url = import.meta.env.VITE_BACKEND;
  try {
    const apiUrl = `${url}my_location`;
    const response = await fetch(apiUrl);
    if (response.ok) {
      const res = (await response.json()) as ApiResponse<IPInfo>;
      return res;
    }
  } catch (error) {
    console.log("Error en la petición");
  }
  return null;
};
