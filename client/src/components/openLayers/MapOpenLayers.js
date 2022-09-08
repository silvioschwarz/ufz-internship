import React, { useState } from "react";
// import './App.css';
import Map from "./Map";
import { ImageLayer, Layers, TileLayer, VectorLayer } from "./Layers";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { imageStatic, osm, vector } from "./Source";
import {
  fromLonLat,
  get,
  transform,
  transformExtent,
  Projection,
} from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";

import proj4 from "proj4";
import { register } from "ol/proj/proj4";

import Static from "ol/source/ImageStatic";

import {
  Controls,
  FullScreenControl,
  MousePositionControl,
  OverviewMapControl,
  ZoomControl,
} from "./Controls";
import { set } from "ol/transform";

let colormap = require("colormap");

// attributation: https://github.com/mbrown3321/openlayers-react-map

let styles = {
  Point: new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({
        color: "rgba(0, 255, 0, 0.8)",
      }),
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
      color: "rgba(0, 0, 255, 0.)",
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
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 0, 0)",
    }),
  }),
};


const MapOpenLayers = (props) => {

  if (props.showSegmentation) {
    // console.log(props.segmentationData);
    let extentIMG = transformExtent(
      new vector({
        features: new GeoJSON().readFeatures(props.segmentationData),
      }).getExtent(),
      "EPSG:4326",
      "EPSG:3857"
    );


    let width = props.segmentationData.width;
    let height = props.segmentationData.height;
    var imgextent = [0, 0, width, height];

    let projection = new Projection({
      units: "pixels",
      extent: extentIMG,
    });



    let canvas = document.createElement("canvas");
    canvas.width = width*3;
    canvas.height = height*2;


    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(width, height);

    var colors = colormap({
      colormap: "jet",
      nshades: props.segmentationData.classes.length,
      format: "rba",
      alpha: 1,
    });

    // for (let i = 0; i < imageData.data.length; i += 4) {
    //   imageData.data[i + 0] = 255; // R value
    //   imageData.data[i + 1] = 255; // G value
    //   imageData.data[i + 2] = 255; // B value
    //   imageData.data[i + 3] = 100; // getRandomInt(255);  // A value
    // }

    props.segmentationData.features.map((element) => {
      // console.log(element);

      const index = (element.properties.index)*4;
      // const index = ((element.properties.y) * width+ element.properties.x) * 4;
      
      if (props.segmentationClass == "maxClass") {
        imageData.data[(index + 0)] = colors[element.properties.maxClass - 1][0]; // R value
        imageData.data[(index + 1)] = colors[element.properties.maxClass - 1][1]; // G value
        imageData.data[(index + 2)] = colors[element.properties.maxClass - 1][2]; // B value
        imageData.data[(index + 3)] = 100; // getRandomInt(255);  // A value
    } else {
        imageData.data[(index + 0)] = 0; // R value
        imageData.data[(index + 1)] = 0; // G value
        imageData.data[(index + 2)] = 0; // B value
        imageData.data[(index + 3)] =
          0.5 * 255 +
          0.5 * element.properties.classes[props.segmentationClass] * 255; // getRandomInt(255);  // A value
      };
    });

    // Draw image data to the canvas

    // console.log(imageData.data);
    ctx.putImageData(imageData, 0, 0);
    // ctx.putImageData(imageData, 0, 0);

    var dataURL = canvas.toDataURL();

    var sourceImage = new Static({
      url: dataURL,
      projection: projection,
      imageExtent: extentIMG,
      imageSmoothing: false,
      imageSize:[width,height]
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
      <Map
        center={fromLonLat(props.center)}
        zoom={props.zoom}
        extent={props.extent}
        setClickedCoord={props.setClickedCoord}

      >
        <Layers>
          {/* BaseMap */}
          <TileLayer source={osm()} zIndex={0} />
          {/* Segmentation Raster */}
          {props.showSegmentation && <ImageLayer source={sourceImage} />}
          {/* top points */}
          {props.showSegmentation && props.showTopPoints && (
            <VectorLayer
              source={vector({
                features: new GeoJSON({
                  dataProjection: "EPSG:4326",
                  featureProjection: "EPSG:3857",
                }).readFeatures(props.topPoints),
              })}
              style={function (feature) {
                // console.log(feature)
                return new Style({
                  image: new CircleStyle({
                    radius: 10,
                    fill: new Fill({
                      color: colors[feature.values_.maxClass-1],
                    }),
                    stroke: new Stroke({
                      color: colors[feature.values_.maxClass-1],
                    }),
                  }),
                });
              }}
            />
          )}

          {/* GEOJSON OF RASTER DATA */}
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
          )}
           */}
          {/* RoadNetwork */}
          {props.showRoadNetwork && props.roadNetwork && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(props.roadNetwork, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={styles.Line}
            />
          )}
          {/* buffered Roads */}
          {/* {props.showRoadNetwork && props.roadNetwork && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(props.buffRoads, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={styles.MultiPolygon}
            />
          )} */}
          {/* BoundingBox */}
          {props.showRoadNetwork && props.roadNetwork && (
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
          {/* Route */}
          {props.route && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(props.route, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              style={styles.LineGreen}
              zIndex={1}
            />
          )}
          {/* GEOJSON OF Start End Points */}
          {props.startEndGeoJSON && props.showStartEndPoint && (
          <VectorLayer
              source={vector({
                features: new GeoJSON({
                  featureProjection: 'EPSG:3857'
                }).readFeatures(props.startEndGeoJSON),
              })}
              style={[styles.Point]}
              zIndex={3}
            />
          )}
          
        </Layers>
        <Controls>
          <FullScreenControl />
          <ZoomControl />
          <OverviewMapControl source={osm()} />
          {/* <MousePositionControl /> */}
        </Controls>
      </Map>
    </div>
  );
};
export default MapOpenLayers;
