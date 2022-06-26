import React from "react";

import MapOpenLayers from "./openLayers/MapOpenLayers";
import Sidebar from "./Sidebar";

var osmtogeojson = require("osmtogeojson");

export default function Main() {
  const [showLayer1, setShowLayer1] = React.useState(false);
  const isMounted = React.useRef(false)

  const [motorway, setMotorway] = React.useState(false);
  const [trunk, setTrunk] = React.useState(false);
  const [primary, setPrimary] = React.useState(false);

  const [roadTypes, setRoadTypes] = React.useState([]);

  const [geoJSONObject, setGeoJSONObject] = React.useState([]);

  const bbox = [52.4, 13.25, 52.6, 13.4];

  function handleRoadTypes(){
    let roads = Array.from(document.querySelectorAll(
      '#roadTypes input[type="checkbox"]:checked'
    )).map((road) => {

      if(road.value==="motorway"){
        setMotorway(true)
      }

      if(road.value==="trunk"){
        setTrunk(true)
      }

      if(road.value==="primary"){
        setPrimary(true)
      }


      return(road.value)
    });

    setRoadTypes(roads)

   


    // setMotorway(prevState => !prevState)
    // setTrunk(prevState => !prevState)
    // setPrimary(prevState => !prevState)
    };

  console.log(roadTypes);

  let query = "data=";
  query += `[bbox:${bbox.join(",")}]`;
  query += "[out:json][timeout:25];";
  query += "(";

  roadTypes.map((road) =>{
    query += `way["highway"="${road}"];`
  })
  // query += 'way["highway"="motorway"];';
  // query += 'node["leisure"]["access"!="private"]["sport"="swimming"];'
  // query += 'node["access"!="private"]["leisure"="swimming_pool"];'
  // query += 'way["leisure"]["access"!="private"]["sport"="swimming"];'
  // query += 'way["access"!="private"]["leisure"="swimming_pool"];'
  // query += 'relation["leisure"]["access"!="private"]["sport"="swimming"];'
  // query += 'relation["access"!="private"]["leisure"="swimming_pool"];'
  query += ")";
  query += ";out geom;>;";

  console.log(query)

  React.useEffect(() => {
    setShowLayer1(false)
    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    })
      .then((res) => {
        console.log(res);
        if (!res.ok) {
          throw new Error("Network response was not OK");
        }
        return res.json();
      })
      .then((json) => {
        const geojson = osmtogeojson(json, {
          flatProperties: true,
        });
        console.log(geojson);
        setGeoJSONObject(geojson);
        setShowLayer1(true)
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
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
        <aside>
          <div>
            <input
              type="checkbox"
              checked={showLayer1}
              onChange={(event) => setShowLayer1(event.target.checked)}
            />{" "}
            Show Path 1
          </div>
          <div>
            <input type="file" />
            <hr></hr>
          </div>
          <div id="roadTypes">
            <h4>Road Types</h4>
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
          </div>
        </aside>
        {/* <Sidebar /> */}
      </div>
    </main>
  );
}
