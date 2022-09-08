import React, { useContext, useEffect, useState } from "react";
import { MousePosition } from "ol/control";
import MapContext from "../Map/MapContext";

const MousePositionControl = () => {
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;

		let mousePositionControl = new MousePosition({});

		map.controls.push(mousePositionControl);

		return () => map.controls.remove(mousePositionControl);
	}, [map]);

	return null;
};

export default MousePositionControl;