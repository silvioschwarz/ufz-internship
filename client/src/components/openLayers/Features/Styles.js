import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

export default {
  Point: new Style({
    image: new CircleStyle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: "magenta",
      }),
    }),
  }),
  Line: new Style({
    stroke: new Stroke({
      color: "red",
      width: 1,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),

  LineGreen: new Style({
    stroke: new Stroke({
      color: "green",
      width: 1,
    }),
    fill: new Fill({
      color: "rgba(0, 255, 0, 0.1)",
    }),
  }),

  Polygon: new Style({
    stroke: new Stroke({
      color: "blue",
      lineDash: [4],
      width: 3,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
  MultiPolygon: new Style({
    stroke: new Stroke({
      color: "blue",
      width: 1,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
};
