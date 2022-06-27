import React from "react";

import MapOpenLayers from "./openLayers/MapOpenLayers";
import Sidebar from "./Sidebar";

import BeatLoader from "react-spinners/BeatLoader";

// import styled, { css } from "styled-components";
// import "../css/loader.css";

// const ConditionalWrapper = ({ condition, wrapper, children }) =>
//   condition ? wrapper(children) : children;

// const osmtogeojson = require('osmtogeojson');
const osm2geojson = require("osm2geojson-lite");

export default function Main() {
  const [showLayer1, setShowLayer1] = React.useState(false);
  const [loaded, setLoaded] = React.useState(true);
  const isMounted = React.useRef(false);

  const [motorway, setMotorway] = React.useState(false);
  const [trunk, setTrunk] = React.useState(false);
  const [primary, setPrimary] = React.useState(false);

  const [roadTypes, setRoadTypes] = React.useState([]);

  const [geoJSONObject, setGeoJSONObject] = React.useState(false);

  const bbox = [52.4, 13.25, 52.6, 13.4];

  function handleRoadTypes() {
    setMotorway(false);
    setPrimary(false);
    setTrunk(false);

    let roads = Array.from(
      document.querySelectorAll('#roadTypes input[type="checkbox"]:checked')
    ).map((road) => {
      if (road.value === "motorway") {
        setMotorway(true);
      }

      if (road.value === "trunk") {
        setTrunk(true);
      }

      if (road.value === "primary") {
        setPrimary(true);
      }

      return road.value;
    });

    setRoadTypes(roads);

    // setMotorway(prevState => !prevState)
    // setTrunk(prevState => !prevState)
    // setPrimary(prevState => !prevState)
  }

  console.log(roadTypes);

  let query = "data=";
  query += `[bbox:${bbox.join(",")}]`;
  query += "[out:xml][timeout:25];";
  query += "(";

  roadTypes.map((road) => {
    query += `way["highway"=${road}];`;
  });
  // query += 'way["highway"="motorway"];';
  // query += 'node["leisure"]["access"!="private"]["sport"="swimming"];'
  // query += 'node["access"!="private"]["leisure"="swimming_pool"];'
  // query += 'way["leisure"]["access"!="private"]["sport"="swimming"];'
  // query += 'way["access"!="private"]["leisure"="swimming_pool"];'
  // query += 'relation["leisure"]["access"!="private"]["sport"="swimming"];'
  // query += 'relation["access"!="private"]["leisure"="swimming_pool"];'
  query += ")";
  query += ";out geom;>;";

  console.log(query);

  React.useEffect(() => {
    if (isMounted.current) {
      setLoaded(false);
      setShowLayer1(false);
      fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
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
          // console.log(data)
          let geojson = osm2geojson(data, {});
          console.log(geojson);
          // const geojson = osmtogeojson(data);
          // console.log(geojson);
          setGeoJSONObject(geojson);
          setShowLayer1(true);
          setLoaded(true);
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        });
    } else {
      isMounted.current = true;
    }
  }, [roadTypes]);

  // React.useEffect(()=>{
  //   if(isMounted.current){
  //     setGeoJSONObject(geojson);
  //   } else {
  //     isMounted.current=true;
  //   }
  // },[geoJSONObject])

  // function handleDatum() {
  //   let newDatum = document.getElementById("test-date2").value;
  //   setDatum(newDatum);
  // }

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

  return (
    <main>
      <p>Main Content</p>
      <div className="main-content">
        <MapOpenLayers
          showLayer1={showLayer1}
          data={geoJSONObject}
          bbox={bboxObject}
        />
        <div className="selection-div">
          {!loaded && (
            <div className="loading-div">
              <BeatLoader />
            </div>
          )}

          <aside>
            <h3>Plan optimal route</h3>
            <div>
              <h4>Input Segmentation File</h4>
              <input type="file" />
              <hr></hr>
            </div>
            <div id="roadTypes">
              <h4>Road Types</h4>
              <div>
                <input
                  type="checkbox"
                  checked={showLayer1}
                  onChange={(event) => setShowLayer1(event.target.checked)}
                />{" "}
                Show Roads
              </div>
              <hr />
              <input
                type="checkbox"
                id="motorway"
                name="motorway"
                value="motorway"
                checked={motorway}
                onChange={handleRoadTypes}
              />
              <label htmlFor="motorway"> motorway</label>
              <br />
              <input
                type="checkbox"
                id="trunk"
                name="trunk"
                value="trunk"
                checked={trunk}
                onChange={handleRoadTypes}
              />
              <label htmlFor="trunk"> trunk</label>
              <br />
              <input
                type="checkbox"
                id="primary"
                name="primary"
                value="primary"
                checked={primary}
                onChange={handleRoadTypes}
              />
              <label htmlFor="primary"> primary</label>
              <br />
              <hr />
            </div>
            <div>
              <h4>Calculation</h4>
              <h4>Choose output</h4>
              <input type="file" />
            </div>
          </aside>
        </div>

        {/* <Sidebar /> */}
      </div>
    </main>
  );
}
