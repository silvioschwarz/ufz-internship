import { ImageStatic as ImageStaticSource } from "ol/source";

function imageStatic({ url, attributions, projection, imageExtent}) {
	return new ImageStaticSource({ url, attributions, projection, imageExtent });
}

export default imageStatic;
