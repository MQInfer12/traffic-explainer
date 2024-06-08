import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import { Traceroute } from "../services/getMyLocation";

// Function to create a point graphic
const createPoint = (
  lng: number,
  lat: number,
  title: string,
  content: string,
  size: number = 20
) => {
  const popupTemplate = new PopupTemplate({
    title: title,
    content: content,
  });
  const point = new Point({
    longitude: lng,
    latitude: lat,
  });
  const markerSymbol = new SimpleMarkerSymbol({
    color: [226, 119, 40],
    size: size,
    outline: {
      color: [255, 255, 255],
      width: 2,
    },
  });
  return new Graphic({
    geometry: point,
    symbol: markerSymbol,
    popupTemplate: popupTemplate,
  });
};

// Function to create a curve (bezier) between two points
const createCurve = (start: any, end: any) => {
  const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
  // Add control points for the curve
  const controlPoint1 = [
    (start[0] + midpoint[0]) / 2,
    start[1] + (end[1] - start[1]) / 4,
  ];
  const controlPoint2 = [
    (midpoint[0] + end[0]) / 2,
    end[1] - (end[1] - start[1]) / 4,
  ];

  return new Polyline({
    paths: [[start, controlPoint1, controlPoint2, end]],
  });
};

export const initializeMap = (
  container: HTMLDivElement,
  center: [string, string],
  tracert: Traceroute[]
) => {
  const LngLat = center.map((v) => Number(v));

  const map = new Map({
    basemap: "gray",
  });

  const view = new MapView({
    container,
    map: map,
    zoom: 4,
    center: LngLat,
  });

  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  // Add the initial point (center)
  const centerPointGraphic = createPoint(
    LngLat[0],
    LngLat[1],
    "Centro",
    "Punto de inicio"
  );
  graphicsLayer.add(centerPointGraphic);

  // Add traceroute points
  const points = tracert
    .map((hop, index) => {
      if (hop.lat && hop.lng) {
        const pointGraphic = createPoint(
          Number(hop.lng),
          Number(hop.lat),
          `Salto ${index + 1}`,
          `IP: ${hop.ip}, Tiempo: ${hop.ms} ms`,
          12
        );
        graphicsLayer.add(pointGraphic);
        return [Number(hop.lng), Number(hop.lat)];
      }
    })
    .filter((point) => point); // Filter out any undefined points

  // Create and add curve lines between the center and the first point, and between subsequent points
  if (points.length > 0) {
    // Connect center to the first point
    const firstCurve = createCurve([LngLat[0], LngLat[1]], points[0]);
    const firstLineSymbol = new SimpleLineSymbol({
      color: [0, 0, 255],
      width: 2,
    });
    const firstLineGraphic = new Graphic({
      geometry: firstCurve,
      symbol: firstLineSymbol,
    });
    graphicsLayer.add(firstLineGraphic);
  }

  // Connect subsequent points
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const curve = createCurve(start, end);

    const lineSymbol = new SimpleLineSymbol({
      color: [0, 0, 255],
      width: 2,
    });

    const lineGraphic = new Graphic({
      geometry: curve,
      symbol: lineSymbol,
    });

    graphicsLayer.add(lineGraphic);
  }

  view
    .when()
    .then(() => {
      console.log("Map ready");
    })
    .catch((error) => {
      console.error("Error loading map:", error);
    });

  return () => {
    if (view) {
      //@ts-ignore
      view.container = null;
    }
  };
};
