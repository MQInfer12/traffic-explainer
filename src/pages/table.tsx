import { useCallback, useMemo, useState } from "react";
import Button from "../components/button";
import { WebRequest } from "../interfaces/webRequest";
import { formatDate } from "../utils/formatDate";
import { twClass } from "../utils/twClass";
import { useOptions } from "../hooks/useOptions";
import { toastError, toastSuccess } from "../utils/toasts";

interface Props {
  requests: WebRequest[];
  newMessage: (msg: string) => void;
}

interface Data {
  id: string;
  row: WebRequest;
  type: string;
  label: string;
}

type Active = {
  td: HTMLElement;
  data: Data;
} | null;

const Table = ({ requests, newMessage }: Props) => {
  const [active, setActive] = useState<Active>(null);
  const [compareWith, setCompareWith] = useState<Active>(null);

  const activeTd = active?.td;

  const { options, setOpen, setReference } = useOptions(
    compareWith?.td.id === activeTd?.id
      ? [
          {
            title: "Dejar de comparar",
            onClick: () => {
              setCompareWith(null);
            },
          },
        ]
      : [
          {
            title: "Copiar",
            onClick: async () => {
              try {
                await navigator.clipboard.writeText(active?.data.label || "");
                toastSuccess("Copiado exitosamente");
              } catch (err) {
                toastError("Error al copiar");
              }
            },
          },
          {
            title: "¿Qué es esto?",
            onClick: () => {
              newMessage(
                `¿Qué significa que ${active?.data.type} de la petición HTTP sea ${active?.data.label}?`
              );
            },
          },
          {
            title: "Comparar",
            onClick: () => {
              setCompareWith(active);
            },
          },
          {
            title: "Explicar fila entera",
            onClick: () => {
              if (!active) return;
              const {
                row: { initiator, url, statusCode, type, method },
              } = active.data;
              newMessage(
                `¿Puedes explicarme qué significa esta petición completa?\n\nOrigen: ${initiator}\nURL: ${url}\nEstado: ${statusCode}\nTipo de recurso: ${type}\nMétodo: ${method}`
              );
            },
          },
        ],
    () => {
      setActive(null);
    }
  );

  const methods = useMemo<{
    [key: string]: string;
  }>(
    () => ({
      GET: "bg-sky-200",
      POST: "bg-lime-200",
      PUT: "bg-amber-200",
      DELETE: "bg-rose-200",
      PATCH: "bg-fuchsia-200",
      HEAD: "bg-pink-200",
      CONNECT: "bg-indigo-200",
      OPTIONS: "bg-red-200",
      TRACE: "bg-violet-200",
    }),
    []
  );

  const tdClasses =
    "p-2 px-2 border border-gray-300 transition-all duration-75";
  const hoverClasses = "cursor-pointer hover:invert-[12%] hover:bg-[#FEFEFE]";
  const activeClasses = "invert-[12%] bg-[#FEFEFE]";
  const twTd = twClass(tdClasses, hoverClasses);

  const handleTdClick = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>, data: Data) => {
      setActive({
        td: event.currentTarget,
        data,
      });
      setReference(event.currentTarget);
      setOpen(true);
    },
    [setOpen, setReference]
  );

  const handleCompare = (data: Data) => {
    newMessage(
      `Explícame cuál podría la diferencia entre ${compareWith?.data.type} ${compareWith?.data.label} de esta petición HTTP y ${data.type} ${data.label} de esta otra`
    );
    setCompareWith(null);
  };

  return (
    <div className="h-full w-full p-6">
      {options}
      <div className="w-full h-full border-2 overflow-auto border-gray-300">
        <table className="w-full table-fixed">
          <thead className="sticky top-0">
            <tr>
              <th className="p-2 bg-gray-200 border border-gray-300 w-10">
                <p className="text-sm text-black/80">#</p>
              </th>
              <th className="p-2 bg-gray-200 border border-gray-300 w-56">
                <p className="text-sm text-black/80">Origen</p>
              </th>
              <th className="p-2 bg-gray-200 border border-gray-300 w-96">
                <p className="text-sm text-black/80">URL</p>
              </th>
              <th className="p-2 bg-gray-200 border border-gray-300 w-16">
                <p className="text-sm text-black/80">Estado</p>
              </th>
              <th className="p-2 bg-gray-200 border border-gray-300 w-40">
                <p className="text-sm text-black/80">Tipo</p>
              </th>
              <th className="p-2 bg-gray-200 border border-gray-300 w-20">
                <p className="text-sm text-black/80">Método</p>
              </th>
              <th className="p-2 bg-gray-200 border border-gray-300 w-40">
                <p className="text-sm text-black/80">Fecha</p>
              </th>
              <th className="p-2 bg-gray-200 border border-gray-300 w-20">
                <p className="text-sm text-black/80">Controles</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((v, i) => (
              <tr key={v.id}>
                <td className={tdClasses}>
                  <p className="text-[12px] font-medium text-black/80 text-center">
                    {i + 1}
                  </p>
                </td>
                <td
                  id={`id_${v.id}_1`}
                  className={twClass(
                    twTd,
                    activeTd?.id === `id_${v.id}_1` && activeClasses,
                    compareWith?.td.id === `id_${v.id}_1` && "bg-amber-900/20"
                  )}
                  title={v.initiator}
                  onClick={(e) => {
                    const data: Data = {
                      id: `id_${v.id}_1`,
                      row: v,
                      type: "el origen",
                      label: v.initiator || "vacío",
                    };
                    if (compareWith && compareWith.td.id !== data.id) {
                      handleCompare(data);
                      return;
                    }
                    handleTdClick(e, data);
                  }}
                >
                  <p className="text-sm font-medium text-black/80 whitespace-nowrap text-ellipsis overflow-hidden">
                    {v.initiator}
                  </p>
                </td>
                <td
                  id={`id_${v.id}_2`}
                  className={twClass(
                    twTd,
                    activeTd?.id === `id_${v.id}_2` && activeClasses,
                    compareWith?.td.id === `id_${v.id}_2` && "bg-amber-900/20"
                  )}
                  title={v.url}
                  onClick={(e) => {
                    const data: Data = {
                      id: `id_${v.id}_2`,
                      row: v,
                      type: "la URL",
                      label: v.url,
                    };
                    if (compareWith && compareWith.td.id !== data.id) {
                      handleCompare(data);
                      return;
                    }
                    handleTdClick(e, data);
                  }}
                >
                  <p className="text-sm font-medium text-black/80 whitespace-nowrap text-ellipsis overflow-hidden">
                    {v.url}
                  </p>
                </td>
                <td
                  id={`id_${v.id}_3`}
                  className={twClass(
                    twTd,
                    activeTd?.id === `id_${v.id}_3` && activeClasses,
                    compareWith?.td.id === `id_${v.id}_3` && "bg-amber-900/20"
                  )}
                  onClick={(e) => {
                    const data: Data = {
                      id: `id_${v.id}_3`,
                      row: v,
                      type: "el estado",
                      label: String(v.statusCode),
                    };
                    if (compareWith && compareWith.td.id !== data.id) {
                      handleCompare(data);
                      return;
                    }
                    handleTdClick(e, data);
                  }}
                >
                  <p className="text-sm font-medium text-black/80">
                    {v.statusCode}
                  </p>
                </td>
                <td
                  id={`id_${v.id}_4`}
                  className={twClass(
                    twTd,
                    activeTd?.id === `id_${v.id}_4` && activeClasses,
                    compareWith?.td.id === `id_${v.id}_4` && "bg-amber-900/20"
                  )}
                  onClick={(e) => {
                    const data: Data = {
                      id: `id_${v.id}_4`,
                      row: v,
                      type: "el tipo de recurso",
                      label: v.type,
                    };
                    if (compareWith && compareWith.td.id !== data.id) {
                      handleCompare(data);
                      return;
                    }
                    handleTdClick(e, data);
                  }}
                >
                  <p className="text-sm font-medium text-black/80">{v.type}</p>
                </td>
                <td
                  id={`id_${v.id}_5`}
                  className={twClass(
                    twTd,
                    activeTd?.id === `id_${v.id}_5` && activeClasses,
                    compareWith?.td.id === `id_${v.id}_5` && "bg-amber-900/20"
                  )}
                  onClick={(e) => {
                    const data: Data = {
                      id: `id_${v.id}_5`,
                      row: v,
                      type: "el método",
                      label: v.method,
                    };
                    if (compareWith && compareWith.td.id !== data.id) {
                      handleCompare(data);
                      return;
                    }
                    handleTdClick(e, data);
                  }}
                >
                  <div className="flex justify-center">
                    <p
                      className={twClass(
                        "text-[12px] font-bold text-black/60 text-center rounded-full px-3",
                        methods[v.method] || "bg-stone-400"
                      )}
                    >
                      {v.method}
                    </p>
                  </div>
                </td>
                <td
                  id={`id_${v.id}_6`}
                  className={twClass(
                    twTd,
                    activeTd?.id === `id_${v.id}_6` && activeClasses,
                    compareWith?.td.id === `id_${v.id}_6` && "bg-amber-900/20"
                  )}
                  onClick={(e) => {
                    const data: Data = {
                      id: `id_${v.id}_6`,
                      row: v,
                      type: "el tiempo de envio",
                      label: formatDate(v.timeStamp),
                    };
                    if (compareWith && compareWith.td.id !== data.id) {
                      handleCompare(data);
                      return;
                    }
                    handleTdClick(e, data);
                  }}
                >
                  <p className="text-sm font-medium text-black/80 whitespace-nowrap">
                    {formatDate(v.timeStamp)}
                  </p>
                </td>
                <td className={tdClasses}>
                  <div className="flex justify-center">
                    <Button>Mapa</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
