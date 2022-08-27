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

proj4.defs(
  "EPSG:31468",
  "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs"
);

register(proj4);

const MapOpenLayers = (props) => {


  // console.log(props)

  // var extent = [
  //   1212700.7209014362, 6733000.138551631, 1282400.298953579,
  //   6780300.3349028155,
  // ];

  

  if (props.showSegmentation) {
    // console.log(props.segmentationData);
    let extentIMG = transformExtent(
      new vector({
        features: new GeoJSON().readFeatures(props.segmentationData),
      }).getExtent(),
      "EPSG:4326",
      "EPSG:3857"
    );

    // let extentIMG = new vector({
    //   features: new GeoJSON().readFeatures(props.segmentationData),
    // }).getExtent();


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

    var colors = colormap({
      colormap: "jet",
      nshades: props.segmentationData.classes.length,
      format: "rba",
      alpha: 1,
    });

    // let segmentationClasses = Object.keys(props.segmentationData.features[0].properties.classes);
    // console.log(segmentationClasses)

    // console.log("colormap")
    // console.log(colors)

    // console.log(props.segmentationClass)

    // for (let i = 0; i < imageData.data.length; i += 4) {
    // Modify pixel data
    //   imageData.data[i + 0] = 255; // R value
    //   imageData.data[i + 1] = 255; // G value
    //   imageData.data[i + 2] = 255; // B value
    //   imageData.data[i + 3] = 100; // getRandomInt(255);  // A value
    // }

    

    if(props.segmentationClass =="maxClass"){

    props.segmentationData.features.map((element) => {
      // console.log(element);

      // let index = element.properties.index*4;
      const index = (element.properties.y * width + element.properties.x) * 4;
      // console.log("index")
      // console.log(index)

      imageData.data[index + 0] = colors[(element.properties.maxClass-1)][0]; // R value
      imageData.data[index + 1] = colors[(element.properties.maxClass-1)][1]; // G value
      imageData.data[index + 2] = colors[(element.properties.maxClass-1)][2]; // B value
      imageData.data[index + 3] = 100; // getRandomInt(255);  // A value
    });}
    else{
      props.segmentationData.features.map((element) => {
        // console.log("element")
        // console.log(element.properties.classes[props.segmentationClass]);
  
        // let index = element.properties.index*4;
        const index = (element.properties.y * width + element.properties.x) * 4;
        // console.log("index")
        // console.log(index)
  
        imageData.data[index + 0] = 0; // R value
        imageData.data[index + 1] = 0; // G value
        imageData.data[index + 2] = 0; // B value
        imageData.data[index + 3] = 0.5*255+0.5*element.properties.classes[props.segmentationClass]*255; // getRandomInt(255);  // A value
      });
  
    }

    // Draw image data to the canvas

    // console.log(imageData.data);
    ctx.putImageData(imageData, 0, 0);
    var dataURL = canvas.toDataURL();

    var sourceImage = new Static({
      url: dataURL,
      projection: projection,
      imageExtent: extentIMG,
      imageSmoothing: false
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
      >
        <Layers>
          {/* BaseMap */}
          <TileLayer source={osm()} zIndex={0} />
          {/* Segmentation Raster */}
          {props.showSegmentation && <ImageLayer source={sourceImage} />}
          {/* top points */}
          {props.showSegmentation && props.showTopPoints &&(
            <VectorLayer
            source={vector({
              features: new GeoJSON({
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
              }).readFeatures(props.topPoints),
            })}
            style={function(feature){
              // console.log(feature)
              return new Style({
                image: new CircleStyle({
                  radius: 10,
                  fill: new Fill({
                    color: colors[feature.values_.maxClass],
                  }),
                  stroke: new Stroke({
                    color: colors[feature.values_.maxClass],
                  }),
                }),
              })
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
