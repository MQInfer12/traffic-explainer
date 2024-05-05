import data from "../mocks/data.json";

const Table = () => {
  return (
    <div className="h-full w-full p-6">
      <div className="w-full h-full border-2 overflow-auto border-gray-300">
        <table className="w-full">
          <thead className="sticky top-0">
            <tr>
              <th className="p-2 bg-gray-200 border border-gray-300">
                <p className="text-sm text-black/80">Nombre</p>
              </th>
              <th className="p-2 bg-gray-200 border border-gray-300">
                <p className="text-sm text-black/80">Estado</p>
              </th>
              <th className="p-2 bg-gray-200 border border-gray-300">
                <p className="text-sm text-black/80">Tipo</p>
              </th>
              <th className="p-2 bg-gray-200 border border-gray-300">
                <p className="text-sm text-black/80">Tamaño</p>
              </th>
              <th className="p-2 bg-gray-200 border border-gray-300">
                <p className="text-sm text-black/80">Duración</p>
              </th>
              <th className="p-2 bg-gray-200 border border-gray-300">
                <p className="text-sm text-black/80">Controles</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((v) => (
              <tr>
                <td className="p-1 px-2 border border-gray-300">
                  <p className="text-sm font-medium text-black/80">{v.name}</p>
                </td>
                <td className="p-1 px-2 border border-gray-300">
                  <p className="text-sm font-medium text-black/80">{v.state}</p>
                </td>
                <td className="p-1 px-2 border border-gray-300">
                  <p className="text-sm font-medium text-black/80">{v.type}</p>
                </td>
                <td className="p-1 px-2 border border-gray-300">
                  <p className="text-sm font-medium text-black/80 text-end">
                    {v.size} Kbs
                  </p>
                </td>
                <td className="p-1 px-2 border border-gray-300">
                  <p className="text-sm font-medium text-black/80 text-end">
                    {v.duration} ms
                  </p>
                </td>
                <td className="p-1 px-2 border border-gray-300">
                  <button>Ver</button>
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
