import { useEffect, useRef } from "react";
import { initializeMap } from "../utils/map";

interface Props {
  center: [string, string];
}

const MapView = ({ center }: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup = null;
    if (elementRef.current) {
      cleanup = initializeMap(elementRef.current, center);
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
