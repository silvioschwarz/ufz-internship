import React from "react";

import MapOpenLayers from "./openLayers/MapOpenLayers";
import Sidebar from "./Sidebar";
import FileUpload from "./FileUpload";

import data from "../data/berlin_bezirke.json";
// import styled, { css } from "styled-components";
// import "../css/loader.css";

// const ConditionalWrapper = ({ condition, wrapper, children }) =>
//   condition ? wrapper(children) : children;

// const osmtogeojson = require('osmtogeojson');
const osm2geojson = require("osm2geojson-lite");

export default function Main() {
  const [showLayer1, setShowLayer1] = React.useState(false);
  const [showSegmentation, setShowSegmentation] = React.useState(false);
  const [dataSegmentation, setDataSegmentation] = React.useState(
    require("../data/berlin_bezirke.json")
  );

  const [loaded, setLoaded] = React.useState(true);
  const isMounted = React.useRef(false);

  const [motorway, setMotorway] = React.useState(false);
  const [trunk, setTrunk] = React.useState(false);
  const [primary, setPrimary] = React.useState(false);

  const [roadTypes, setRoadTypes] = React.useState([]);

  const [geoJSONObject, setGeoJSONObject] = React.useState(false);

  const bbox = [52.4, 13.25, 52.6, 13.4];

  // function handleRoadTypes() {
  //   setMotorway(false);
  //   setPrimary(false);
  //   setTrunk(false);

  //   let roads = Array.from(
  //     document.querySelectorAll('.roadTypes input[type="checkbox"]:checked')
  //   ).map((road) => {
  //     if (road.value === "motorway") {
  //       setMotorway(true);
  //     }

  //     if (road.value === "trunk") {
  //       setTrunk(true);
  //     }

  //     if (road.value === "primary") {
  //       setPrimary(true);
  //     }

  //     return road.value;
  //   });
  //   // console.log(roads);

  //   setRoadTypes(roads);

  //   // setMotorway(prevState => !prevState)
  //   // setTrunk(prevState => !prevState)
  //   // setPrimary(prevState => !prevState)
  // }

  // React.useEffect(() => {
  //   if (isMounted.current) {
  //     setLoaded(false);
  //     setShowLayer1(false);

  //     console.log(roadTypes);

  //     let query = "data=";
  //     query += `[bbox:${bbox.join(",")}]`;
  //     query += "[out:xml][timeout:25];";
  //     query += "(";

  //     roadTypes.map((road) => {
  //       query += `way["highway"=${road}];`;
  //     });
  //     // query += 'way["highway"="motorway"];';
  //     // query += 'node["leisure"]["access"!="private"]["sport"="swimming"];'
  //     // query += 'node["access"!="private"]["leisure"="swimming_pool"];'
  //     // query += 'way["leisure"]["access"!="private"]["sport"="swimming"];'
  //     // query += 'way["access"!="private"]["leisure"="swimming_pool"];'
  //     // query += 'relation["leisure"]["access"!="private"]["sport"="swimming"];'
  //     // query += 'relation["access"!="private"]["leisure"="swimming_pool"];'
  //     query += ")";
  //     query += ";out geom;>;";

  //     console.log(query);

  //     fetch("https://overpass-api.de/api/interpreter", {
  //       method: "POST",
  //       body: query,
  //     })
  //       .then((res) => {
  //         console.log(res);

  //         if (!res.ok) {
  //           throw new Error("Network response was not OK");
  //         } else {
  //           console.log("fetched!");
  //         }
  //         return res.text();
  //       })
  //       .then((data) => {
  //         console.log(data);
  //         let geojson = osm2geojson(data, {});
  //         console.log(geojson);
  //         // const geojson = osmtogeojson(data);
  //         // console.log(geojson);
  //         setGeoJSONObject(geojson);
  //         setShowLayer1(true);
  //         setLoaded(true);
  //       })
  //       .catch((error) => {
  //         console.error(
  //           "There has been a problem with your fetch operation:",
  //           error
  //         );
  //       });
  //   } else {
  //     isMounted.current = true;
  //   }
  // }, [roadTypes]);

  const bboxObject = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [bbox[1], bbox[0]],
              [bbox[1], bbox[2]],
              [bbox[3], bbox[2]],
              [bbox[3], bbox[0]],
            ],
          ],
        },
        properties: {
          prop0: "value0",
          prop1: { this: "that" },
        },
      },
    ],
  };

  const [selectedFile, setSelectedFile] = React.useState();
  const [isFilePicked, setIsFilePicked] = React.useState(false);
  const [isSelected, setIsSelected] = React.useState(false);
  const [segmentationData, setSegmentationData] = React.useState({
    type: "FeatureCollection",
    features: [],
  });

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);

    // console.log(event.target.files[0].name);

    // event.target.files[0].text().then((res) => {
    //     const data = csvToArray(res);
    //     // console.log(data);

    //     let segData = [];

    //     const temp = data.map((element) => {

    //       let { Latitude: lat, Longitude: lon, ...propers } = element;

    //       //   console.log(element)
    //       segData.push({
    //         type: "Feature",
    //         geometry: {
    //           type: "Point",
    //           coordinates: [[lon, lat]],
    //         },
    //         properties: {
    //           ...propers,
    //         },
    //       });

    //       setSegmentationData({
    //         type: "FeatureCollection",
    //         features: segData,
    //       });
    //     });
    //   });

  }



  React.useEffect(() => {
    // if (isMounted.current) {
    if (isSelected) {
      console.log(selectedFile.name);

      selectedFile.text().then((res) => {
          const data = csvToArray(res);
          // console.log(data);
  
          let segData = [];
  
          const temp = data.map((element) => {
  
            let { Latitude: lat, Longitude: lon, ...propers } = element;
  
            //   console.log(element)
            segData.push({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [lat,lon],
              },
              properties: {
                ...propers,
              },
            });
  
            setSegmentationData({
              type: "FeatureCollection",
              features: segData,
            });
          });
        });
      }
    // }
  }, [selectedFile]);

  function csvToArray(str, delimiter = ",") {
    const rows = str.split("\n");
    const headers = rows.shift().split(delimiter);

    const arr = rows.map(function (row) {
      const values = row.split(delimiter);
      const el = headers.reduce(function (object, header, index) {
        object[header] = parseFloat(values[index]);
        return object;
      }, {});
      return el;
    });

    // return the array
    return arr.slice(0, -1);
  }

  console.log(segmentationData)


  return (
    <main>
      <MapOpenLayers
        showLayer1={showLayer1}
        data={geoJSONObject}
        showSegmentation={showSegmentation}
        segmentationData={segmentationData}
        bbox={bboxObject}
      />
      <Sidebar
        loaded={loaded}
        selected={isSelected}
        changeHandler={changeHandler}
        showLayer1={showLayer1}
        setShowLayer1={setShowLayer1}
        showSegmentation={showSegmentation}
        setShowSegmentation={setShowSegmentation}
      />
    </main>
  );
}
