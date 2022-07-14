import React, { useState } from "react";
// import './App.css';
import Map from "./Map";
import { Layers, TileLayer, VectorLayer } from "./Layers";
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from "ol/style";
import { osm, vector } from "./Source";
import { fromLonLat, get, transform,transformExtent } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { getCenter, getEnlargedArea } from "ol/extent";
import { getArea, getLength } from "ol/sphere";

import DataTile from "ol/source/DataTile";
import TileLayerT from 'ol/layer/WebGLTile';


import {
  Controls,
  FullScreenControl,
  OverviewMapControl,
  ZoomControl,
} from "./Controls";

// attributation: https://github.com/mbrown3321/openlayers-react-map

let styles = {
  Point: new Style({
    image: new CircleStyle({
      radius: 1,
      fill: null,
      stroke: new Stroke({
        color: "magenta",
      }),
    }),
  }),
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

import Projection from 'ol/proj/Projection';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';



proj4.defs(
  "EPSG:31468",
  "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs");

register(proj4);




const MapOpenLayers = (props) => {
  // console.log(props)
  const [center, setCenter] = useState([9.0, 52.5]);
  const [zoom, setZoom] = useState(7);
  // const [extent, setExtent] = useState([1212787.7209014362, 6733006.138551631, 1282450.298953579, 6780305.3349028155])


var extent = [1212787.7209014362, 6733006.138551631, 1282450.298953579, 6780305.3349028155]

  if(props.showSegmentation){
      let extent = transformExtent(new vector({
    features: new GeoJSON().readFeatures(props.segmentationData)
  }).getExtent(), 'EPSG:31468', 'EPSG:3857')

  console.log(extent)
  }

  return (
    <div className="map-container">
      <Map center={fromLonLat(center)} zoom={zoom} extent={extent}>
        <Layers>
          <TileLayer source={osm()} zIndex={0} />
          {props.showSegmentation  && (
          <VectorLayer
              source={vector({
                features: new GeoJSON({
                  dataProjection: 'EPSG:31468',
                  featureProjection: 'EPSG:3857'
                }).readFeatures(props.segmentationData),
              })}
              style={styles.Point}
            />
          )}

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
