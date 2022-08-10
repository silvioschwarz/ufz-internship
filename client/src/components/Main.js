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
import { vector } from "./openLayers/Source";
import { extent } from "ol/extent";

// import proj4 from "proj4";
// import { register } from "ol/proj/proj4";

// proj4.defs(
//   "EPSG:31468",
//   "+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=4500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs"
// );

// register(proj4);

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
  const [route, setRoute] = React.useState();
  const [showRoute, setShowRoute] = React.useState(false);

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

  const roadSelectionHandler = (event) => {
    let selectedRoadTypes = Array.from(
      document.querySelectorAll('.roadTypes input[type="checkbox"]:checked')
    ).map((road) => road.value);
    // console.log("roadSelection")
    // console.log(selectedRoadTypes)
    setRoadSelection(selectedRoadTypes);

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
        properties: {
          prop0: "value0",
          prop1: { this: "that" },
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
    if (isSegmentationSelected) {
      // console.log(segmentationFile.name);

      segmentationFile.text().then((res) => {
        const data = csvToArray(res);

        const lons = [...new Set(data.map((item) => item.Longitude))].sort();
        const lats = [...new Set(data.map((item) => item.Latitude))].sort();
        let width = lats.length;
        let height = lons.length;
        let xIntervall = (Math.max(...lats) - Math.min(...lats)) / (width - 1);
        let yIntervall = (Math.max(...lons) - Math.min(...lons)) / (height - 1);

        let xMin = Math.min(...lats);
        let xMax = Math.max(...lats);
        let yMin = Math.min(...lons);
        let yMax = Math.max(...lons);

        let segmentationClasses = Object.keys(data[0]).slice(2);
        // let numClasses = segmentationClasses.length;
        setClasses(segmentationClasses);

        let segmentationFeatures = [];

        const temp = data.map((element) => {
          let { Latitude: lat, Longitude: lon, ...propers } = element;
          let x = (lat - xMin) / xIntervall;
          let y = (lon - yMax) / -yIntervall;

          let index = y * width + x;

          let maxClass =
            Object.values(propers)
              .map((x, i) => [x, i])
              .reduce((r, a) => (a[0] > r[0] ? a : r))[1] + 1;

          segmentationFeatures.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [lat, lon],
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
          const n = 2;
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
          "EPSG:31468",
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
    // }
  }, [segmentationFile]);

  if (showSegmentation) {
    const tabElement = document.getElementById("tab-segmentation").firstChild;
    // tabElement.classList.remove("active");
    tabElement.classList.add("done");
  }

  if (loadRoadNetwork) {
    const tabElement = document.getElementById("tab-roadnetwork").firstChild;
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

  React.useEffect(() => {
    // if (document.getElementById("roadNetwork").classList.contains("active")) {
    //   setIsRoadActive((prevState) => !prevState);
    // }

    let query = "13.388860,52.517037;13.397634,52.529407;13.428555,52.523219";
    query += "?geometries=geojson";

    // console.log(query);

    //     GET
    // /trip/v1/{profile}/{coordinates}?roundtrip={true|false}&source{any|first}&destination{any|last}&steps={true|false}&geometries={polyline|polyline6|geojson}&overview={simplified|full|false}&annotations={true|false}'
    // Example Requests
    // 'http://router.project-osrm.org/trip/v1/driving/13.388860,52.517037;13.397634,52.529407;13.428555,52.523219'

    fetch("http://router.project-osrm.org/trip/v1/driving/" + query, {
      method: "POST",
      body: query,
    })
      .then((res) => {
        // console.log(res);

        if (!res.ok) {
          throw new Error("Network response was not OK");
        } else {
          // console.log("fetched!");
        }
        return res.text();
      })
      .then((data) => {
        // console.log(data);
        setRoute(data);
        // let geojson = osm2geojson(data, {});
        // console.log(geojson);
        // const geojson = osmtogeojson(data);
        // console.log(geojson);
        // setGeoJSONObject(geojson);
        // setRoadNetwork(geojson);
        // setIsRoadLoaded(true);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }, [loadRoadNetwork]);

  return (
    <main>
      <MapOpenLayers
        zoom={zoom}
        center={center}
        extent={extent}
        showSegmentation={showSegmentation}
        segmentationData={segmentationData}
        segmentationProjection={segmentationProjection}
        segmentationClass={segmentationClass}
        showTopPoints={showTopPoints}
        topPoints={topPoints}
        showRoadNetwork={showRoadNetwork}
        roadNetwork={roadNetwork}
        bbox={bboxObject}
        showRoute={showRoute}
        route={route}
      />
      <Sidebar
        segmentationHandler={segmentationHandler}
        isSegmentationSelected={isSegmentationSelected}
        showSegmentation={showSegmentation}
        setShowSegmentation={setShowSegmentation}
        segmentationProjection={segmentationProjection}
        setSegmentationProjection={setSegmentationProjection}
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
      />
    </main>
  );
}
