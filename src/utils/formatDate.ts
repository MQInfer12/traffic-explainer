export const formatDate = (timestamp: number) => {
  const fechaObjeto = new Date(timestamp);

  const año = fechaObjeto.getFullYear();
  const mes = fechaObjeto.getMonth() + 1;
  const día = fechaObjeto.getDate();

  const horas = fechaObjeto.getHours();
  const minutos = fechaObjeto.getMinutes();
  const segundos = fechaObjeto.getSeconds();

  const fechaFormateada = `${año}-${mes < 10 ? "0" : ""}${mes}-${
    día < 10 ? "0" : ""
  }${día}`;
  const horaFormateada = `${horas < 10 ? "0" : ""}${horas}:${
    minutos < 10 ? "0" : ""
  }${minutos}:${segundos < 10 ? "0" : ""}${segundos}`;

  return `${fechaFormateada} ${horaFormateada}`;
};
