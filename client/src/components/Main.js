import React from "react";

import MapOpenLayers from "./openLayers/MapOpenLayers";
import Sidebar from "./Sidebar";

import BeatLoader from "react-spinners/BeatLoader";

import data from '../data/berlin_bezirke.json';
// import styled, { css } from "styled-components";
// import "../css/loader.css";

// const ConditionalWrapper = ({ condition, wrapper, children }) =>
//   condition ? wrapper(children) : children;

// const osmtogeojson = require('osmtogeojson');
const osm2geojson = require("osm2geojson-lite");

export default function Main() {
  const [showLayer1, setShowLayer1] = React.useState(false);
  const [showSegmentation, setShowSegmentation] = React.useState(false);
  const [dataSegmentation, setDataSegmentation] = React.useState( require("../data/berlin_bezirke.json"));


  const [loaded, setLoaded] = React.useState(true);
  const isMounted = React.useRef(false);

  const [motorway, setMotorway] = React.useState(false);
  const [trunk, setTrunk] = React.useState(false);
  const [primary, setPrimary] = React.useState(false);

  const [roadTypes, setRoadTypes] = React.useState([]);

  const [geoJSONObject, setGeoJSONObject] = React.useState(false);

  const bbox = [52.4, 13.25, 52.6, 13.4];

  function handleRoadTypes() {
    // setMotorway(false);
    // setPrimary(false);
    // setTrunk(false);

    let roads = Array.from(
      document.querySelectorAll('.roadTypes input[type="checkbox"]:checked')
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
    console.log(roads)

    setRoadTypes(roads);

    // setMotorway(prevState => !prevState)
    // setTrunk(prevState => !prevState)
    // setPrimary(prevState => !prevState)
  }

  

  React.useEffect(() => {
    if (isMounted.current) {
      setLoaded(false);
      setShowLayer1(false);

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

      fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
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
          console.log(data)
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
  //   if (isMounted.current) {
  //     setLoaded(false);
  //     setShowSegmentation(false);

  //     setDataSegmentation(data)
  //     setLoaded(true);
  //     setShowSegmentation(true);

  //   } else {
  //     isMounted.current = true;
  //   }

  // },[dataSegmentation])

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
      <div className="main-content">
        <MapOpenLayers
          showLayer1={showLayer1}
          data={geoJSONObject}
          showSegmentation={showSegmentation}
          dataSegmentation={dataSegmentation}
          bbox={bboxObject}
        />
        <div className="selection-div">
          {!loaded && (
            <div className="loading-div">
              <BeatLoader />
            </div>
          )}

          <aside>
            <div className="aside-child">

              <fieldset>
                <legend>
                  Input Segmentation
                </legend>

                <div className="flexx-row">
                <div className="mb-0 w-50">
                  {/* <label htmlFor="formFile" className="form-label"></label> */}
                  <input
                    className="form-control form-control-sm"
                    type="file"
                    id="formFile"
                  />
                </div>
                <select id="EPSG" name="EPSG">
                  <option>Select EPSG</option>
                  <option disabled>_________</option>
                  <option>4326</option>
                  <option>35644764</option>
                  <option>4</option>
                  <option>4446</option>
                </select>
                </div>
                <input
                  type="checkbox"
                  checked={showSegmentation}
                  onChange={(event) => setShowSegmentation(event.target.checked)}
                />{" "}
                Show Segementation
              </fieldset>
            </div>

            <div className="aside-child">
              <fieldset>
                <legend>
                  Input Road network
                </legend>
                <div className="flexx-row">
                <fieldset  style={{ display: "inline" }}>
                  <input type="radio" name="roadNetwork" /> use default
                  <br />
                  <input type="radio" name="roadNetwork" /> use own road network
                </fieldset>
                <br />
                <div className="mb-0 w-50">
                  <label htmlFor="formFile" className="form-label">Own road Network</label>
                  <input
                    className="form-control form-control-sm"
                    type="file"
                    id="formFile"
                  />
                </div>
                </div>
                <input
                  type="checkbox"
                  checked={showLayer1}
                  onChange={(event) => setShowLayer1(event.target.checked)}
                />{" "}
                Show Road Network
                <fieldset className="roadTypes">
                  <legend>Select Roads to show</legend>
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
                </fieldset>
              </fieldset>
            </div>

            <div className="aside-child">
              <fieldset>
                <legend>
                  Find Optimal Route
                </legend>
                <div className="flexx-row">
                  <fieldset className="w-75" style={{ display: "inline" }}>
                    <input type="radio" name="criteria1" /> Best points
                    <br />
                    <input type="radio" name="criteria1" /> Best road segments
                  </fieldset>
                  <div>                   
                    Length of Segment (km): <br></br>
                    <input className="w-75" type="number" />
                     </div>
                </div>
                <div  className="flexx-row">
                <fieldset className="w-50" style={{ display: "inline" }}>
                  <input type="radio" name="criteria2" /> Find a loop
                  <br />
                  <input type="radio" name="criteria2" /> Define Start/End
                </fieldset>
                <div className="w-50">
                  Start coordinates:<br/> <input className="w-50" type="number" placeholder="Easting"></input><input className="w-50" type="number" placeholder="Northing"></input> <br/>
                  End coordinates:<br/> <input className="w-50" type="number" placeholder="Easting"></input><input className="w-50" type="number" placeholder="Northing"></input>
                </div>
                </div>
                Desired route length (km):<br/> <input  className="w-50" type="number"></input>
                <button className="m-1">Start calc</button>
              </fieldset>
            </div>

            <div className="aside-child">
              <fieldset>
                <legend>
                  Export
                </legend>
                <button className="m-2" type="button">
                  Save Route
                </button>
                <button className="m-2" type="button">
                  Save Image
                </button>
              </fieldset>
            </div>
          </aside>
        </div>

        {/* <Sidebar /> */}
      </div>
    </main>
  );
}
