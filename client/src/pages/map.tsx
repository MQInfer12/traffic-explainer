import { useEffect, useState } from "react";
import { IPInfo, api_getMyLocation } from "../services/getMyLocation";
import Loader from "../components/loader/loader";
import MapView from "../components/mapView";

const Map = () => {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);

  useEffect(() => {
    const getIpInfo = async () => {
      const res = await api_getMyLocation();
      if (res) {
        setIpInfo(res.data);
      }
    };
    getIpInfo();
  }, []);

  return (
    <div className="w-full h-full p-6">
      <div className="w-full h-full border-2 border-gray-300 rounded-lg">
        {ipInfo ? (
          <MapView center={[ipInfo.longitud, ipInfo.latitud]} />
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default Map;
