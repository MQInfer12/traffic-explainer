export interface IPInfo {
  ciudad: string;
  latitud: string;
  longitud: string;
  pais: string;
}

export interface Traceroute {
  ip: string;
  ms: number;
  lat: string;
  lng: string;
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

export const api_traceroute = async (to: string) => {
  const url = "http://localhost:5000/";
  try {
    const apiUrl = `${url}tracert`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: to }),
    });
    console.log(response);
    if (response.ok) {
      const res = (await response.json()) as ApiResponse<Traceroute[]>;
      return res;
    }
  } catch (error) {
    console.log("Error en la petición");
  }
  return null;
};
