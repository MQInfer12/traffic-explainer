import { IChat } from "../App";
import { WebRequest } from "../interfaces/webRequest";

export const api_getAIResponse = async (
  chat: IChat[],
  requests: WebRequest[],
  callback: (res: string) => void
) => {
  const lastHundredRequestsContext = requests
    .filter((_, i) => i < 100)
    .map(
      (v) =>
        `${v.id},${v.initiator},${v.statusCode},${v.type},${v.method},${v.timeStamp}`
    )
    .join(";");
  const token = import.meta.env.VITE_OPENAI;
  try {
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const prompt =
      "Eres un asistente virtual experto en seguridad informática con conocimiento avanzado en peticiones HTTP y posibles vulnerabilidades de estas," +
      " perteneces a una aplicación extensión del navegador llamada Traffic Explainer que explica el tráfico de red mientras el usuario navega la web," +
      " tienes un apartado de tabla donde se muestran las peticiones realizadas por el navegador con las siguientes columnas: Origen; URL; Estado; Tipo; Método; Fecha;" +
      " el usuario tiene la opción de preguntarte acerca de cualquier dato de cualquier columna haciendo click encima y seleccionando la opción '¿Qué es esto?'," +
      " también puede preguntarte comparando dos datos seleccionando la opción 'Comparar' o si gusta preguntarte acerca de la petición entera con la opción 'Explicar fila entera', " +
      " Y tienes un apartado de mapa donde se revisará el trazado de ruta hacia cada petición," +
      " abstente lo más que puedas a ayudar en otro tipo de temas que no sean de tu área..." +
      " Si el usuario en algún momento te pide que le muestres las peticiones de la tabla que sean maliciosas tendrás el contexto de la tabla de peticiones en una cadena de las últimas 100 peticiones separadas por ';' con el siguiente formato:" +
      " `Id,Origen,URL,Estado,Tipo,Método,Fecha;Id,Origen,URL,Estado,Tipo,Método,Fecha;Id,Origen,URL,Estado,Tipo,Método,Fecha;...;` lo que tienes que hacer es analizar el string y devolver un json con el siguiente formato formato (no utilices otro formato que no sea el especificado ni tampoco listes cuales son, solamente el json si quieres con un párrafo introductorio): " +
      ' `{"el id como key":"motivo de por que es sospechosa la petición",...}` de las peticiones que te parezcan sospechosas por algún motivo de los datos o que tengan origenes con malware según tu base de datos de conocimiento de tu entrenamiento para que pueda ser parseado en el código y remarcado en la tabla, aquí está la cadena: `' +
      lastHundredRequestsContext +
      "`";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: prompt,
          },
          ...chat.map((message) => ({
            role: message.me ? "user" : "assistant",
            content: message.content,
          })),
        ],
        temperature: 1,
        max_tokens: 1200,
        stream: true,
      }),
    });

    if (response.ok && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      while (true) {
        const chunk = await reader.read();
        const { done, value } = chunk;
        if (done) {
          break;
        }
        const decodedChunk = decoder.decode(value);
        const lines = decodedChunk.split("\n");
        const parsedLines = lines
          .map((line) => line.replace(/^data: /, ""))
          .filter((line) => line !== "" && line !== "[DONE]")
          .map((line) => JSON.parse(line));
        for (const parsedLine of parsedLines) {
          const { choices } = parsedLine;
          const { delta } = choices[0];
          const { content } = delta;
          if (content) {
            callback(content);
          }
        }
      }
    }
  } catch (error) {
    console.log("Error en la petición");
    console.log(error);
  }
};
