import { useEffect, useState } from "react";
import {
  IPInfo,
  Traceroute,
  api_getMyLocation,
  api_traceroute,
} from "../services/getMyLocation";
import Loader from "../components/loader/loader";
import MapView from "../components/mapView";

interface Props {
  to: string | null;
}

const Map = ({ to }: Props) => {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [tracert, setTracert] = useState<Traceroute[] | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getIpInfoTracert = async () => {
      const res = await api_getMyLocation();
      if (res) {
        setIpInfo(res.data);
      }
      if (to) {
        const resT = await api_traceroute(to);
        if (resT) {
          setTracert(resT.data);
        }
      }
      setLoaded(true);
    };
    getIpInfoTracert();
  }, []);

  return (
    <div className="w-full h-full p-6">
      <div className="w-full h-full border-2 border-gray-300 rounded-lg relative">
        {to && (
          <div className="absolute top-2 right-2 z-50 px-4 rounded-md bg-primary-950/60 text-white">
            Viendo ruta hacia: <span className="text-primary-400">{to}</span>
          </div>
        )}
        {loaded && ipInfo ? (
          <MapView
            tracert={tracert || []}
            center={[ipInfo.longitud, ipInfo.latitud]}
          />
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default Map;
