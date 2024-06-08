import { useEffect, useRef } from "react";
import { initializeMap } from "../utils/map";
import { Traceroute } from "../services/getMyLocation";

interface Props {
  center: [string, string];
  tracert: Traceroute[];
}

const MapView = ({ center, tracert }: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup = null;
    if (elementRef.current) {
      cleanup = initializeMap(elementRef.current, center, tracert);
    }
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div
      className="w-full h-full rounded-lg overflow-hidden outline-none"
      ref={elementRef}
    />
  );
};

export default MapView;
