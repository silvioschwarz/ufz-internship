import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import OLImageLayer from "ol/layer/Image";

const ImageLayer = ({ source, style, zIndex = 0 }) => {
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;

		let imageLayer = new OLImageLayer({
			source,
			style
		});

		map.addLayer(imageLayer);
		imageLayer.setZIndex(zIndex);

		return () => {
			if (map) {
				map.removeLayer(imageLayer);
			}
		};
	}, [map]);

	return null;
};

export default ImageLayer;