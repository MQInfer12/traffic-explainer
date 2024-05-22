import Button from "../components/button";
import { WebRequest } from "../interfaces/webRequest";
import { formatDate } from "../utils/formatDate";
import { twClass } from "../utils/twClass";

interface Props {
  requests: WebRequest[];
}

const Table = ({ requests }: Props) => {
  const methods: {
    [key: string]: string;
  } = {
    GET: "bg-sky-200",
    POST: "bg-lime-200",
    PUT: "bg-amber-200",
    DELETE: "bg-rose-200",
    PATCH: "bg-fuchsia-200",
    HEAD: "bg-pink-200",
    CONNECT: "bg-indigo-200",
    OPTIONS: "bg-red-200",
    TRACE: "bg-violet-200",
  };

  return (
    <div className="h-full w-full p-6">
      <div className="w-full h-full border-2 overflow-auto border-gray-300">
        <table className="w-full table-fixed">
          <thead className="sticky top-0">
            <tr>
              <th className="p-2 bg-gray-200 border border-gray-300 w-10">
                <p className="text-sm text-black/80">#</p>
              </th>
              <th className="p-2 bg-gray-200 border border-gray-300 w-64">
                <p className="text-sm text-black/80">Origen</p>
              </th>
              <th className="p-2 bg-gray-200 border border-gray-300 w-80">
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
                <td className="p-1 px-2 border border-gray-300">
                  <p className="text-[12px] font-medium text-black/80 text-center">
                    {i + 1}
                  </p>
                </td>
                <td
                  className="p-1 px-2 border border-gray-300"
                  title={v.initiator}
                >
                  <p className="text-sm font-medium text-black/80 whitespace-nowrap text-ellipsis overflow-hidden">
                    {v.initiator}
                  </p>
                </td>
                <td className="p-1 px-2 border border-gray-300" title={v.url}>
                  <p className="text-sm font-medium text-black/80 whitespace-nowrap text-ellipsis overflow-hidden">
                    {v.url}
                  </p>
                </td>
                <td className="p-1 px-2 border border-gray-300">
                  <p className="text-sm font-medium text-black/80">
                    {v.statusCode}
                  </p>
                </td>
                <td className="p-1 px-2 border border-gray-300">
                  <p className="text-sm font-medium text-black/80">{v.type}</p>
                </td>
                <td className="p-1 px-2 border border-gray-300">
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
                <td className="p-1 px-2 border border-gray-300">
                  <p className="text-sm font-medium text-black/80 whitespace-nowrap">
                    {formatDate(v.timeStamp)}
                  </p>
                </td>
                <td className="p-1 px-2 border border-gray-300">
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
