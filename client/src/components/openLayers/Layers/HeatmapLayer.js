import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import OLHeatmapLayer from "ol/layer/Heatmap";

const HeatmapLayer = ({ source, style, zIndex = 0, blur, radius, weight }) => {
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;

		let heatmapLayer = new OLHeatmapLayer({
			source,
            blur,
            radius,
            weight,
			style
		});

		map.addLayer(heatmapLayer);
		heatmapLayer.setZIndex(zIndex);

		return () => {
			if (map) {
				map.removeLayer(heatmapLayer);
			}
		};
	}, [map]);

	return null;
};

export default HeatmapLayer;