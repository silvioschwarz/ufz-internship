import React, { useContext, useEffect, useState } from "react";
import { OverviewMap } from "ol/control";
import MapContext from "../Map/MapContext";
import OLTileLayer from "ol/layer/Tile";
import { View } from "ol";

const OverviewMapControl = ({ source }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    let overviewMapControl = new OverviewMap({
      className: "ol-overviewmap",
      view: new View({ projection: "EPSG:3857" }),
      layers: [
        new OLTileLayer({
          source: source,
        }),
      ],
      collapsed: true,
      collapseLabel: "\u00BB",
      label: "\u00AB",
    });

    map.controls.push(overviewMapControl);

    return () => map.controls.remove(overviewMapControl);
  }, [map]);

  return null;
};

export default OverviewMapControl;
