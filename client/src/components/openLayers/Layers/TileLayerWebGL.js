import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import OLTileLayerWebGL from "ol/layer/WebGLTile";

const TileLayerWebGL = ({ source, zIndex = 0 }) => {
	const { map } = useContext(MapContext);

	useEffect(() => {
		if (!map) return;

		let tileLayerwebgl = new OLTileLayerWebGL({
			source,
			zIndex,
		});

		map.addLayer(tileLayerwebgl);
		tileLayerwebgl.setZIndex(zIndex);

		return () => {
			if (map) {
				map.removeLayer(tileLayerwebgl);
			}
		};
	}, [map]);

	return null;
};

export default TileLayerWebGL;
