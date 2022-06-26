import React from "react";

import MapOpenLayers from "./openLayers/MapOpenLayers";


export default function Main() {

  const [showLayer1, setShowLayer1] = React.useState(true);
 


  const [geoJSONObject, setGeoJSONObject] = React.useState(
    require("../data/GeoJSON/gis_osm_railways_free_1.json")
  );

  return (
    <main>
      <p>Main Content</p>
      <div className="main-content">
        <MapOpenLayers showLayer1={showLayer1} data={geoJSONObject}/>
        <aside>
        <div>
        <input
          type="checkbox"
          checked={showLayer1}
          onChange={(event) => setShowLayer1(event.target.checked)}
        />{" "}
        Show Path 1
      </div>
        </aside>
      </div>
     
      {/* <div>
        <input
          type="checkbox"
          checked={showLayer2}
          onChange={(event) => setShowLayer2(event.target.checked)}
        />{" "}
        Show Path 2
      </div>
      <div>
        <input
          type="checkbox"
          checked={showLayer3}
          onChange={(event) => setShowLayer3(event.target.checked)}
        />{" "}
        Show heatmap
      </div> */}
    </main>
  );
}
