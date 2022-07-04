import React, { useState } from "react";
// import './App.css';
import Map from "./Map";
import { Layers, TileLayer, VectorLayer } from "./Layers";
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from "ol/style";
import { osm, vector } from "./Source";
import { fromLonLat, get, transform } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { getCenter } from "ol/extent";
import { getArea, getLength } from "ol/sphere";

import {
  Controls,
  FullScreenControl,
  OverviewMapControl,
  ZoomControl,
} from "./Controls";

// attributation: https://github.com/mbrown3321/openlayers-react-map

let styles = {
  MultiPolygon: new Style({
    stroke: new Stroke({
      color: "blue",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
  Line: new Style({
    stroke: new Stroke({
      color: "red",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
  LineGreen: new Style({
    stroke: new Stroke({
      color: "green",
      width: 5,
    }),
    fill: new Fill({
      color: "rgba(0, 255, 0, 0.1)",
    }),
  }),
};

const MapOpenLayers = (props) => {
  console.log(props)
  const [center, setCenter] = useState([13.37, 52.5]);
  const [zoom, setZoom] = useState(11);

  return (
    <div className="map-container">
      <Map center={fromLonLat(center)} zoom={zoom}>
        <Layers>
          <TileLayer source={osm()} zIndex={0} />
          {props.showLayer1 && props.data && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(props.data, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={styles.Line}
            />
          )}
          {props.showLayer1 && props.data && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(props.bbox, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={styles.LineGreen}
              zIndex={1}
            />
          )}
            {props.showSegmentation && props.dataSegmentation && (
            <VectorLayer
            source={vector({
              features: new GeoJSON().readFeatures(props.dataSegmentation, {
                featureProjection: get("EPSG:3857"),
              }),
            })}
            style={styles.MultiPolygon}
            zIndex={1}
          />
          )}
        </Layers>
        <Controls>
          <FullScreenControl />
          <ZoomControl />
          <OverviewMapControl source={osm()} />
        </Controls>
      </Map>
    </div>
  );
};
export default MapOpenLayers;
