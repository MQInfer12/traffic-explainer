import { IChat } from "../App";
import { twClass } from "../utils/twClass";

interface Props {
  message: IChat;
  newMessage: (msg: string) => void;
}

const Message = ({ message, newMessage }: Props) => {
  const renderMarkdown = () => {
    if (message.me) return message.content;
    let text = message.content;
    const boldRegex = /\*\*(.*?)\*\*/g;
    const singleQuoteRegex = /'(.*?)'/g; // Comillas simples
    const doubleQuoteRegex = /"(.*?)"/g; // Comillas dobles
    const acronymRegex =
      /\b([A-ZÁÉÍÓÚÜ]{2,})\b|\b([A-ZÁÉÍÓÚÜ][a-záéíóúü]*\s[A-ZÁÉÍÓÚÜ][a-záéíóúü]*)\b/g;
    const parts: any[] = [];
    let lastIndex = 0;
    const codeBlocks: { [key: string]: string } = {};
    let codeBlockIndex = 0;

    // Buscar y guardar fragmentos de código JSON
    text = text.replace(/```(.*?)```/gs, (_match, p1) => {
      const key = `__CODE_BLOCK_${codeBlockIndex}__`;
      codeBlocks[key] = p1;
      codeBlockIndex++;
      return "**¡Se marcaron las peticiones sospechosas en la tabla!**";
    });

    // Procesar texto
    //@ts-ignore
    text.replace(boldRegex, (match, p1, offset) => {
      pushTextWithParts(text.substring(lastIndex, offset));
      parts.push(
        <strong className="text-primary-800" key={`bold-${offset}`}>
          {p1}
        </strong>
      );
      lastIndex = offset + match.length;
    });

    //@ts-ignore
    text.replace(singleQuoteRegex, (match, p1, offset) => {
      pushTextWithParts(text.substring(lastIndex, offset));
      parts.push(
        <button
          onClick={() => newMessage(`¿Qué significa '${p1}'?`)}
          className="text-primary-700 bg-primary-600/10 border border-black/10 px-2 rounded-md hover:opacity-60 transition-all duration-300"
          key={`single-quote-${offset}`}
        >
          {p1}
        </button>
      );
      lastIndex = offset + match.length;
    });

    //@ts-ignore
    text.replace(acronymRegex, (match, p1, p2, offset) => {
      pushTextWithParts(text.substring(lastIndex, offset));
      parts.push(
        <button
          onClick={() => newMessage(`¿Qué significa '${p1 || p2}'?`)}
          className="text-sky-700 bg-primary-600/10 border border-black/10 px-1 rounded-md hover:opacity-60 transition-all duration-300"
          key={`acronym-${offset}`}
        >
          {p1 || p2}
        </button>
      );
      lastIndex = offset + match.length;
    });

    //@ts-ignore
    text.replace(doubleQuoteRegex, (match, p1, offset) => {
      pushTextWithParts(text.substring(lastIndex, offset));
      parts.push(
        <span className="text-primary-700" key={`double-quote-${offset}`}>
          "{p1}"
        </span>
      );
      lastIndex = offset + match.length;
    });

    // Agregar el texto restante después de los fragmentos de código
    pushTextWithParts(text.substring(lastIndex));

    // Agregar los fragmentos de código JSON
    for (const key in codeBlocks) {
      if (codeBlocks.hasOwnProperty(key)) {
        parts.push(
          <p
            className="px-4 py-2 rounded-md mt-4 bg-primary-800/10"
            key={`code-block-${key}`}
          >
            {codeBlocks[key].replace("json\n", "")}
          </p>
        );
      }
    }

    return parts;

    // Función para agregar texto a las partes
    function pushTextWithParts(textToAdd: string) {
      parts.push(textToAdd);
    }
  };

  return (
    <div
      className={twClass(
        "w-[600px] max-w-full flex",
        message.me ? "self-end justify-end" : "self-start justify-start"
      )}
    >
      <p
        className={twClass(
          "font-bold text-black/60 p-2 px-4 text-sm rounded-b-lg leading-relaxed w-fit animate-[appear_.3s] whitespace-pre-line",
          message.me
            ? "bg-amber-900/30 rounded-tl-lg text-end"
            : "bg-amber-900/10 rounded-tr-lg text-start"
        )}
      >
        {renderMarkdown()}
      </p>
    </div>
  );
};

export default Message;
