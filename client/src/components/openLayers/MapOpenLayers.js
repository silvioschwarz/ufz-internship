import React, { useState } from "react";
// import './App.css';
import Map from "./Map";
import { ImageLayer, Layers, TileLayer, VectorLayer } from "./Layers";
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from "ol/style";
import { imageStatic, osm, vector } from "./Source";
import {
  fromLonLat,
  get,
  transform,
  transformExtent,
  Projection,
} from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { getCenter, getEnlargedArea } from "ol/extent";
import { getArea, getLength } from "ol/sphere";

import DataTile from "ol/source/DataTile";
import TileLayerT from "ol/layer/WebGLTile";

import proj4 from "proj4";
import { register } from "ol/proj/proj4";

import Static from "ol/source/ImageStatic";

import {
  Controls,
  FullScreenControl,
  OverviewMapControl,
  ZoomControl,
} from "./Controls";
import ImageSource from "ol/source/Image";

let colormap = require("colormap");

// attributation: https://github.com/mbrown3321/openlayers-react-map

let styles = {
  Point: new Style({
    image: new CircleStyle({
      radius: 1,
      fill: null,
      stroke: new Stroke({
        color: "green",
      }),
    }),
  }),
  Point2: new Style({
    image: new CircleStyle({
      radius: 1,
      fill: null,
      stroke: new Stroke({
        color: "red",
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

proj4.defs(
  "EPSG:31468",
  "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs"
);

register(proj4);

const MapOpenLayers = (props) => {
  // console.log(props)
  const [center, setCenter] = useState([9.0, 52.5]);
  const [zoom, setZoom] = useState(7);
  // const [extent, setExtent] = useState([1212787.7209014362, 6733006.138551631, 1282450.298953579, 6780305.3349028155])

  var extent = [
    1212700.7209014362, 6733000.138551631, 1282400.298953579,
    6780300.3349028155,
  ];

  if (props.showSegmentation) {
    // console.log(props.segmentationData);
    let extentIMG = transformExtent(
      new vector({
        features: new GeoJSON().readFeatures(props.segmentationData),
      }).getExtent(),
      "EPSG:31468",
      "EPSG:3857"
    );

    // console.log(extentIMG);

    // Map views always need a projection.  Here we just want to map image
    // coordinates directly to map coordinates, so we create a projection that uses
    // the image extent in pixels.
    var width = props.segmentationData.width;
    var height = props.segmentationData.height;
    var imgextent = [0, 0, width, height];

    var projection = new Projection({
      code: "xkcd-image",
      units: "pixels",
      extent: extentIMG,
    });

    // console.log(height)

    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(width, height);

    let colors = colormap({
      colormap: "jet",
      nshades: props.segmentationData.numClasses,
      format: "rba",
      alpha: 1,
    });

    // console.log("colormap")
    // console.log(colors)

    for (let i = 0; i < imageData.data.length; i += 4) {
      // Modify pixel data
      imageData.data[i + 0] = 255; // R value
      imageData.data[i + 1] = 255; // G value
      imageData.data[i + 2] = 255; // B value
      imageData.data[i + 3] = 100; // getRandomInt(255);  // A value
    }

    props.segmentationData.features.map((element) => {
      // console.log(element);

      // let index = element.properties.index*4;
      const index = (element.properties.y * width + element.properties.x) * 4;
      // console.log("index")
      // console.log(index)

      imageData.data[index + 0] = colors[element.properties.maxClass][0]; // R value
      imageData.data[index + 1] = colors[element.properties.maxClass][1]; // G value
      imageData.data[index + 2] = colors[element.properties.maxClass][2]; // B value
      imageData.data[index + 3] = 255; // getRandomInt(255);  // A value
    });
    // Draw image data to the canvas

    console.log(imageData.data);
    ctx.putImageData(imageData, 0, 0);
    var dataURL = canvas.toDataURL();

    var sourceImage = new Static({
      url: dataURL,
      projection: projection,
      imageExtent: extentIMG,
    });
  }

  // function randomColor() {
  //   var r = Math.floor(Math.random() * 256);
  //   var g = Math.floor(Math.random() * 256);
  //   var b = Math.floor(Math.random() * 256);
  //   var color = [r, g, b];

  //   return color;
  // }

  return (
    <div className="map-container">
      <Map center={fromLonLat(center)} zoom={zoom} extent={extent}>
        <Layers>
          <TileLayer source={osm()} zIndex={0} />
          {props.showSegmentation && <ImageLayer source={sourceImage} />}
          {/* {props.showLayer1  && (
          <VectorLayer
              source={vector({
                features: new GeoJSON({
                  dataProjection: 'EPSG:31468',
                  featureProjection: 'EPSG:3857'
                }).readFeatures(props.segmentationData),
              })}
              style={[styles.Point,styles.Point2,styles.Point,styles.Point2]}
            />
          )} */}
          {/*
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
          )} */}
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
