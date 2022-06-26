import React, { useState } from "react";
// import './App.css';
import Map from "./Map";
import { Layers, TileLayer, VectorLayer } from "./Layers";
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from "ol/style";
import { osm, vector } from "./Source";
import { fromLonLat, get, transform } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { getCenter } from "ol/extent";
import {getArea, getLength} from 'ol/sphere';

import { Controls, FullScreenControl, OverviewMapControl } from "./Controls";


// attributation: https://github.com/mbrown3321/openlayers-react-map

let styles = {
  MultiPolygon: new Style({
    stroke: new Stroke({
      color: "blue",
      width: 1,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
  Line: new Style({
    stroke: new Stroke({
      color: "red",
      width: 5,
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
  const [center, setCenter] = useState([13.37, 52.5]);
  const [zoom, setZoom] = useState(11);

  return (
    <div className="map-container">
      <Map center={fromLonLat(center)} zoom={zoom}>
        <Layers>
          <TileLayer source={osm()} zIndex={0} />
          {props.showLayer1 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(props.data, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={styles.Line}
            />
          )}
          {props.showLayer2 && (
            <VectorLayer
              source={vector({
                features: geojsonfeature
              })}
              style={styles.LineGreen}
            />
          )}
        </Layers>
        <Controls>
          <FullScreenControl />
          <OverviewMapControl source={osm()} />
        </Controls>
      </Map>
    </div>
  );
};
export default MapOpenLayers;
