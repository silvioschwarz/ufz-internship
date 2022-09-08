import React from "react";

import MapOpenLayers from "./openLayers/MapOpenLayers";
import Sidebar from "./Sidebar";
import FileUpload from "./FileUpload";

// const osmtogeojson = require('osmtogeojson');
const osm2geojson = require("osm2geojson-lite");

import {
  fromLonLat,
  get,
  transform,
  transformExtent,
  Projection,
} from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import KML from "ol/format/KML"
import GPX from "ol/format/GPX"

import { vector } from "./openLayers/Source";
import { extent } from "ol/extent";

import buffer from "@turf/buffer";
import pointsWithinPolygon from "@turf/points-within-polygon";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import union from "@turf/union";

import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import { Icon } from "ol/style";

var startEndCoords  =[]

export default function Main() {
  //MAP
  const [center, setCenter] = React.useState([9.0, 52.5]);
  const [zoom, setZoom] = React.useState(7);
  const [extent, setExtent] = React.useState([
    1212787.7209014362, 6733006.138551631, 1282450.298953579,
    6780305.3349028155,
  ]);

  //Segmentation
  const [isSegmentationSelected, setIsSegmentationSelected] =
    React.useState(false);
  const [segmentationFile, setSegmentationFile] = React.useState();
  const [segmentationProjection, setSegmentationProjection] = React.useState();
  const [segmentationData, setSegmentationData] = React.useState({
    type: "FeatureCollection",
    features: [],
  });
  const [showSegmentation, setShowSegmentation] = React.useState(false);

  const [segmentationClass, setSegmentationClass] = React.useState("maxClass");
  const [classes, setClasses] = React.useState([]);

  const [showTopPoints, setShowTopPoints] = React.useState(false);
  const [topPoints, setTopPoints] = React.useState({
    type: "FeatureCollection",
    features: [],
  });

  const [cellWidth, setCellWidth] = React.useState(false);
  const [cellHeigth, setCellHeight] = React.useState(false);

  const [EPSG, setEPSG] = React.useState("");

  const handleEPSG = (event) => {
    event.preventDefault();

    fetch("https://epsg.io/?format=json&q=" + EPSG)
      .then((res) => {
        // console.log(res);

        if (!res.ok) {
          throw new Error("Network response was not OK");
        } else {
          console.log("fetched!");
        }
        return res.text();
      })
      .then((data) => {
        // console.log(JSON.parse(data).results[0].proj4);
        setSegmentationProjection([
          "EPSG:" + EPSG,
          JSON.parse(data).results[0].proj4,
        ]);

        proj4.defs("EPSG:" + EPSG, JSON.parse(data).results[0].proj4);

        register(proj4);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });

    setEPSG(EPSG);
  };

  //ROAD NETWORK

  const [useOSMRoadNetwork, setUseOSMRoadNetwork] = React.useState(true);

  const [showRoadNetwork, setShowRoadNetwork] = React.useState(false);
  const [loadRoadNetwork, setLoadRoadNetwork] = React.useState(false);

  const [roadNetwork, setRoadNetwork] = React.useState();

  const [isRoadActive, setIsRoadActive] = React.useState(false);

  const [isRoadLoaded, setIsRoadLoaded] = React.useState(false);
  const isMounted = React.useRef(false);

  const [roadTypes, setRoadTypes] = React.useState([]);
  const [roadSelection, setRoadSelection] = React.useState([]);

  const [geoJSONObject, setGeoJSONObject] = React.useState(false);

  // BoundingBox
  const transformedExtent = transformExtent(extent, "EPSG:3857", "EPSG:4326");
  // const bbox =[52.4, 13.25, 52.6, 13.4];

  const bbox = [
    transformedExtent[1].toFixed(3),
    transformedExtent[0].toFixed(3),
    transformedExtent[3].toFixed(3),
    transformedExtent[2].toFixed(3),
  ];

  // Route
  const [numTopPoints, setNumTopPoints] = React.useState(1);
  const [route, setRoute] = React.useState();
  const [showRoute, setShowRoute] = React.useState(false);

  const [buffered, setBuffered] = React.useState({
    type: "FeatureCollection",
    features: [],
  });

  const[excludedRoad, setExcludedRoad]  =React.useState([])

  const roadSelectionHandler = (event) => {
    let selectedRoadTypes = Array.from(
      document.querySelectorAll('.roadTypes input[type="checkbox"]:checked')
    ).map((road) => road.value);
    // console.log("roadSelection")
    // console.log(selectedRoadTypes)
    setRoadSelection(selectedRoadTypes);

    let excludedRoadTypes = Array.from(
      document.querySelectorAll('.roadTypes input[type="checkbox"]:not(:checked)')
    ).map((road) => road.value);

    setExcludedRoad(excludedRoadTypes);

    // console.log(geoJSONObject)

    let filteredGeoJSON = {
      type: "FeatureCollection",
      features: geoJSONObject.features.filter((feature) => {
        // (selectedRoadTypes.includes(feature.property.highway))
        return selectedRoadTypes.includes(feature.properties.highway);
      }),
    };
    // console.log(filteredGeoJSON);

    setRoadNetwork(filteredGeoJSON);
  };

  const roadNetworkHandler = (event) => {};

  React.useEffect(() => {
    if (isSegmentationSelected) {
      if (!isMounted.current) {
        if (useOSMRoadNetwork) {
          setIsRoadLoaded(false);
          if (
            document.getElementById("roadNetwork").classList.contains("active")
          ) {
            setIsRoadActive((prevState) => !prevState);
          }

          // console.log(roadTypes);

          // let query = "data=";
          // query += `[bbox:${bbox.join(",")}]`;
          // query += "[out:xml][timeout:25];";
          // query += "(";

          // roadTypes.map((road) => {
          //   query += `way["highway"=${road}];`;
          // });
          // // query += 'way["highway"="motorway"];';
          // // query += 'node["leisure"]["access"!="private"]["sport"="swimming"];'
          // // query += 'node["access"!="private"]["leisure"="swimming_pool"];'
          // // query += 'way["leisure"]["access"!="private"]["sport"="swimming"];'
          // // query += 'way["access"!="private"]["leisure"="swimming_pool"];'
          // // query += 'relation["leisure"]["access"!="private"]["sport"="swimming"];'
          // // query += 'relation["access"!="private"]["leisure"="swimming_pool"];'
          // query += ")";
          // query += ";out geom;>;";

          // console.log(query);

          let queryAllRoads = "data=";
          queryAllRoads += `[bbox:${bbox.join(",")}]`;
          queryAllRoads += "[out:xml][timeout:50];";
          queryAllRoads += "(";
          queryAllRoads += `way["highway"~"motorway|trunk|primary|motorway_link|trunk_link|primary_link|unclassified|tertiary|secondary|track|path|residential|service|secondary_link|tertiary_link"];`;
          queryAllRoads += ")";
          queryAllRoads += ";out geom;>;";

          // console.log(queryAllRoads);

          fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: queryAllRoads,
          })
            .then((res) => {
              // console.log(res);

              if (!res.ok) {
                throw new Error("Network response was not OK");
              } else {
                console.log("fetched!");
              }
              return res.text();
            })
            .then((data) => {
              // console.log(data);
              let geojson = osm2geojson(data, {});
              // console.log(geojson);
              // const geojson = osmtogeojson(data);
              // console.log(geojson);
              setGeoJSONObject(geojson);
              setRoadNetwork(geojson);
              setIsRoadLoaded(true);
            })
            .catch((error) => {
              console.error(
                "There has been a problem with your fetch operation:",
                error
              );
            });
        }
      } else {
        isMounted.current = true;
      }
    }
  }, [loadRoadNetwork]);

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
      },
    ],
  };

  React.useEffect(() => {
    if (geoJSONObject) {
      let propHighway = [];
      geoJSONObject.features.map((feature) => {
        propHighway.push(feature.properties.highway);

        // console.log(feature.properties.highway)
      });
      // let uniqueRoadtype = [...new Set(roadtype)]
      // console.log(uniqueRoadtype)
      setRoadTypes([...new Set(propHighway)]);
      setRoadSelection([...new Set(propHighway)]);
    }
  }, [isRoadLoaded]);

  React.useEffect(() => {
    if (loadRoadNetwork) {
      setShowRoadNetwork((prevState) => !prevState);
      setTimeout(function () {
        setShowRoadNetwork(true);
      }, 50);
    }
  }, [roadNetwork]);

  // Segmentation Data

  const segmentationHandler = (event) => {
    setSegmentationFile(event.target.files[0]);
    setIsSegmentationSelected(true);
  };

  React.useEffect(() => {
    // if (isMounted.current) {
    if (isSegmentationSelected && EPSG) {
      // console.log(segmentationFile.name);

      segmentationFile.text().then((res) => {
        const data = csvToArray(res);

        const lons = [...new Set(data.map((item) => item.Longitude))].sort();
        const lats = [...new Set(data.map((item) => item.Latitude))].sort();
        let width = lats.length - 1;
        let height = lons.length - 1;
        let xIntervall = (Math.max(...lats) - Math.min(...lats)) / width;
        let yIntervall = (Math.max(...lons) - Math.min(...lons)) / height;

        setCellWidth(xIntervall);
        setCellHeight(yIntervall);

        // console.log([width,height])
        // console.log([xIntervall,yIntervall])

        let xMin = Math.min(...lats);
        let xMax = Math.max(...lats);
        let yMin = Math.min(...lons);
        let yMax = Math.max(...lons);

        let segmentationClasses = Object.keys(data[0]).slice(2);
        // let numClasses = segmentationClasses.length;
        setClasses(segmentationClasses);

        let segmentationFeatures = [];

        data.map((element) => {
          let { Latitude: lat, Longitude: lon, ...propers } = element;
          let x = (lat - xMin) / xIntervall;
          let y = (yMax - lon) / yIntervall;

          let index = y * width + x;

          let maxClass =
            Object.values(propers)
              .map((x, i) => [x, i])
              .reduce((r, a) => (a[0] > r[0] ? a : r))[1] + 1;

          segmentationFeatures.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: transform([lat, lon], "EPSG:" + EPSG, "EPSG:4326"),
            },
            properties: {
              classes: propers,
              maxClass: maxClass,
              index: index,
              x: x,
              y: y,
            },
          });
        });

        // sort segmentation data descending for each class
        let classArray = segmentationClasses.map((element) => {
          return segmentationFeatures
            .filter((feature) => {
              return (
                feature.properties.maxClass == element.replace("Class", "")
              );
            })
            .sort(
              (a, b) =>
                parseFloat(b.properties.classes.Class1) -
                parseFloat(a.properties.classes.Class1)
            );
        });

        let topFeatures = classArray.map((klasse) => {
          //TODO set n dynamically
          const n = numTopPoints;
          return klasse.slice(0, n);
        });

        let topPointsTemp = {
          type: "FeatureCollection",
          features: topFeatures.flat(),
        };

        let segData = {
          type: "FeatureCollection",
          features: segmentationFeatures,
          classes: segmentationClasses,
          height: height,
          width: width,
        };

        let segExtent = transformExtent(
          new vector({
            features: new GeoJSON().readFeatures(segData),
          }).getExtent(),
          "EPSG:4326",
          "EPSG:3857"
        );

        function getCenterOfExtent(Extent) {
          var X = Extent[0] + (Extent[2] - Extent[0]) / 2;
          var Y = Extent[1] + (Extent[3] - Extent[1]) / 2;
          return [X, Y];
        }

        setCenter(
          transform(getCenterOfExtent(segExtent), "EPSG:3857", "EPSG:4326")
        );
        setExtent(segExtent);
        setSegmentationData(segData);
        setTopPoints(topPointsTemp);
        setShowSegmentation((prevState) => !prevState);
      });
    }
  }, [segmentationProjection, numTopPoints]);

  if (showSegmentation) {
    const tabElement = document.getElementById("tab-segmentation").firstChild;
    // tabElement.classList.remove("active");
    tabElement.classList.add("done");
  }

  if (loadRoadNetwork) {
    const tabElement = document.getElementById("tab-roadnetwork").firstChild;
    tabElement.classList.add("done");
  }

  if (route) {
    const tabElement = document.getElementById("tab-route").firstChild;
    tabElement.classList.add("done");
  }

  function csvToArray(str, delimiter = ",") {
    const rows = str.replace(/\r\n/g, "\n").split("\n");
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
  // ROUTING
  //best points
  //best points  on road
  //max score along path

  // trying to find the points closest to road via points in buffer polygon lets browser freeze

  React.useEffect(() => {
    if (isRoadLoaded) {
      // console.log(roadNetwork);

      const bufferRadius = Math.sqrt(cellWidth ** 2 + cellHeigth ** 2);

      // let pointsOnRoad = []

      // roadNetwork.features.forEach((feature) => {
      //   // console.log(feature)

      //   let bufferedRoad = buffer(feature, bufferRadius / 1000, {
      //     units: "kilometers",
      //   });

      //   // let boolPointInBuffer = segmentationData.features.forEach(
      //   //   (point) => booleanPointInPolygon(point, bufferedRoad))

      //   let pointsInBuffer = pointsWithinPolygon(segmentationData, bufferedRoad)
      // });

      // segmentationData.features.filter((feature) =>{
      //   return(boolea)
      // })

      // console.log(pointsOnRoad.flat().sclice(0,20))

      // score
      // +1 for maxclass
      // const score = pointsInBuffer.map((bufferRoad) =>{
      //   console.log(bufferRoad.features.map((feature)=>{
      //     console.log(feature.properties.classes)
      //   }))
      // })
    }
  }, [isRoadLoaded]);

  const [osmrData, setOsmrData] = React.useState();

  const handleRoute = (event) => {
    event.preventDefault();

    const topCoord = topPoints.features.map((point) => {
      return point.geometry.coordinates;
    });


    let query1="";

    if(startEndCoord.length > 1){
      query1 += startEndCoord[0].geometry.coordinates.join(",") +";"
      query1 += topCoord.join(";");
      query1 += ";"+startEndCoord[1].geometry.coordinates.join(",");
      query1 += "?source=first&destination=last";
      query1 += "&roundtrip=false"
      query1 += "&geometries=geojson";

    }else{
      query1 = topCoord.join(";");
      query1 += "?geometries=geojson";

    }
    // {"message":"Exclude flag combination is not supported.","code":"InvalidValue"}
    // if(excludedRoad.length>0){
    //       query1 +="&exclude=" +excludedRoad.join(",")
    // }
    
    

    
    console.log(query1);

    fetch("http://router.project-osrm.org/trip/v1/driving/" + query1, {
      method: "GET",
    })
      .then((res) => {
        console.log(res);

        if (!res.ok) {
          throw new Error("Network response was not OK");
        } else {
          console.log("fetched!");
        }
        return res.text();
      })
      .then((data) => {
        setOsmrData(data);
        console.log(JSON.parse(data).trips[0].geometry);
        let routeGeoJSON = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: JSON.parse(data).trips[0].geometry,
            },
          ],
        };

        setRoute(routeGeoJSON);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });

    setShowRoadNetwork(false);
    setShowTopPoints(true);
  };

  //EXPORT
  // since everything is done inthe browser, download via a link to a blob

  const [output, setOutput] = React.useState("");

  // URL pointing to the Blob with the file contents
  var objUrl = null;
  // create the blob with file content, and attach the URL to the downloadlink;
  // NB: link must have the download attribute
  // this method can go to your library
  function exportFile() {
    // revoke the old object URL to avoid memory leaks.
    if (objUrl !== null) {
      window.URL.revokeObjectURL(objUrl);
    }
    // create the object that contains the file data and that can be referred to with a URL
    var data = new Blob([osmrData], { type: "text/plain" });
    objUrl = window.URL.createObjectURL(data);
    // attach the object to the download link (styled as button)
    var downloadLinkButton = document.createElement("a");
    downloadLinkButton.download = "export.geojson";
    downloadLinkButton.href = objUrl;
    downloadLinkButton.click();
  }

  // Export as KML
  function exportFile2() {
    // revoke the old object URL to avoid memory leaks.
    if (objUrl !== null) {
      window.URL.revokeObjectURL(objUrl);
    }
    let routeSource =  new vector({
      features: (new GeoJSON()).readFeatures(route)
    })
 
    var kml = new KML().writeFeatures(routeSource.getFeatures(),{
      featureProjection:"EPSG:4326"
    });
    // create the object that contains the file data and that can be referred to with a URL
    var data = new Blob([kml], { type: "text/plain" });
    objUrl = window.URL.createObjectURL(data);
    // attach the object to the download link (styled as button)
    var downloadLinkButton = document.createElement("a");
    downloadLinkButton.download = "export.kml";
    downloadLinkButton.href = objUrl;
    downloadLinkButton.click();
  }

  //Export as GPX
  function exportFile3() {
    // revoke the old object URL to avoid memory leaks.
    if (objUrl !== null) {
      window.URL.revokeObjectURL(objUrl);
    }

    let routeSource =  new vector({
      features: (new GeoJSON()).readFeatures(route)
    })
 
    var gpx = new GPX().writeFeatures(routeSource.getFeatures(),{
      featureProjection:"EPSG:4326"
    });
    // create the object that contains the file data and that can be referred to with a URL
    var data = new Blob([gpx], { type: "text/plain" });
    objUrl = window.URL.createObjectURL(data);
    // attach the object to the download link (styled as button)
    var downloadLinkButton = document.createElement("a");
    downloadLinkButton.download = "export.gpx";
    downloadLinkButton.href = objUrl;
    downloadLinkButton.click();
  }

  // add start and end point

  const [clickedCoord, setClickedCoord] = React.useState(false);
  const [showStartEndPoint, setShowStartEndPoint] = React.useState(false);
  const [startEndCoord, setStartEndCoord] = React.useState([])

  let startEndGeoJSON = {
    type: "FeatureCollection",
    features: startEndCoord,
  };



  React.useEffect(() => {
    if (isRoadLoaded &&  clickedCoord != false) {
      setShowStartEndPoint(false)

      startEndCoords.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: transform(clickedCoord, "EPSG:3857", "EPSG:4326"),
        },
      });

      if (startEndCoords.length > 2) {
        startEndCoords=[];
      }
      setStartEndCoord(startEndCoords)

      setTimeout(function () {
        setShowStartEndPoint(true);
      }, 500);

    
    }
     

  }, [clickedCoord]);


  return (
    <main>
      <MapOpenLayers
        zoom={zoom}
        center={center}
        extent={extent}
        clickedCoord={clickedCoord}
        setClickedCoord={setClickedCoord}
        showSegmentation={showSegmentation}
        segmentationData={segmentationData}
        segmentationProjection={segmentationProjection}
        segmentationClass={segmentationClass}
        showTopPoints={showTopPoints}
        topPoints={topPoints}
        showRoadNetwork={showRoadNetwork}
        roadNetwork={roadNetwork}
        buffRoads={buffered}
        bbox={bboxObject}
        showRoute={showRoute}
        route={route}
        startEndGeoJSON={startEndGeoJSON}
        showStartEndPoint={showStartEndPoint}
      />
      <Sidebar
        segmentationHandler={segmentationHandler}
        isSegmentationSelected={isSegmentationSelected}
        showSegmentation={showSegmentation}
        setShowSegmentation={setShowSegmentation}
        segmentationProjection={segmentationProjection}
        setSegmentationProjection={setSegmentationProjection}
        numTopPoints={numTopPoints}
        setNumTopPoints={setNumTopPoints}
        EPSG={EPSG}
        setEPSG={setEPSG}
        handleEPSG={handleEPSG}
        setSegmentationClass={setSegmentationClass}
        classes={classes}
        showTopPoints={showTopPoints}
        setShowTopPoints={setShowTopPoints}
        useOSMRoadNetwork={useOSMRoadNetwork}
        roadSelectionHandler={roadSelectionHandler}
        roadNetworkHandler={roadNetworkHandler}
        isRoadActive={isRoadActive}
        isRoadLoaded={isRoadLoaded}
        showRoadNetwork={showRoadNetwork}
        setShowRoadNetwork={setShowRoadNetwork}
        loadRoadNetwork={loadRoadNetwork}
        setLoadRoadNetwork={setLoadRoadNetwork}
        roadTypes={roadTypes}
        setRoadTypes={setRoadTypes}
        handleRoute={handleRoute}
        route={route}
        exportFile={exportFile}
        exportFile2={exportFile2}
        exportFile3={exportFile3}
      />
    </main>
  );
}
