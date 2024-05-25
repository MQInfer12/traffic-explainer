import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import PopupTemplate from "@arcgis/core/PopupTemplate";

const createPoint = (lng: number, lat: number, size: number = 20) => {
  const popupTemplate = new PopupTemplate({
    title: "Tu ubicación",
    content: "¡Estás aquí!",
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

export const initializeMap = (
  container: HTMLDivElement,
  center: [string, string]
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

  const pointGraphic = createPoint(LngLat[0], LngLat[1]);

  graphicsLayer.add(pointGraphic);

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
