import { point, featureCollection } from "@turf/turf";
import { bbox } from "@turf/bbox";
import ngeohash from "@/utils/ngeohash.js";

export const useMapTools = (mapInstance) => {
  const fitBounds = async (features, options = {}) => {
    const padding = options?.padding ?? 50;
    const points = featureCollection(features);
    const box = bbox(points);

    mapInstance.value?.fitBounds(box, {
      padding,
      maxZoom: 16,
      duration: 800,
    });
  };

  const getGeohashByNeighbors = (options = {}) => {
    const {
      map = mapInstance.value,
      precision = 7,
      extendLevel = 1,
    } = options;
    const center = map.getCenter();
    const centerHash = ngeohash.encode(center.lat, center.lng, precision);
    const neighbors = ngeohash.neighbors(centerHash);

    let extendedHashes = new Set([centerHash, ...neighbors]);

    if (extendLevel >= 2) {
      const secondLevelNeighbors = [];
      extendedHashes.forEach((hash) => {
        secondLevelNeighbors.push(...ngeohash.neighbors(hash));
      });
      secondLevelNeighbors.forEach((hash) => extendedHashes.add(hash));
    }

    const result = Array.from(extendedHashes);
    console.log(`中心点: ${center.lat.toFixed(4)},${center.lng.toFixed(4)}`);
    console.log(
      `中心Geohash: ${centerHash}, 扩展层级: ${extendLevel}, 总网格数: ${result.length}`
    );

    return result;
  };

  const getGeohashByBounds = (options = {}) => {
    const {
      map = mapInstance.value,
      precision = 6,
    } = options;
    let bounds = map.getBounds();
    console.log(bounds);
    console.log("东北经度", bounds._ne.lng);
    console.log("东北纬度", bounds._ne.lat);
    console.log("西南经度", bounds._sw.lng);
    console.log("西南纬度", bounds._sw.lat);
    let hash2 = ngeohash.bboxes(
      bounds._sw.lat,
      bounds._sw.lng,
      bounds._ne.lat,
      bounds._ne.lng,
      precision
    );
    console.log(hash2);

    return hash2
  };

  const calculateBestViewForFeatures = (features) => {
    if (!features || features.length === 0) return null;

    const featureCollections = featureCollection(features);
    const bboxs = bbox(featureCollections);
    console.log('bboxs', bboxs);

    const latDiff = bboxs[3] - bboxs[1];
    const lngDiff = bboxs[2] - bboxs[0];

    const maxDiff = Math.max(latDiff, lngDiff);
    let maxZoom = 20;
    console.log('maxDiff', maxDiff);

    if (maxDiff > 20) maxZoom = 3;
    else if (maxDiff > 10) maxZoom = 5;
    else if (maxDiff > 5) maxZoom = 8;
    else if (maxDiff > 2) maxZoom = 10;
    else if (maxDiff > 1) maxZoom = 12;
    else if (maxDiff > 0.5) maxZoom = 14;
    else if (maxDiff > 0.2) maxZoom = 16;
    else maxZoom = 18;

    let minZoom = 12;
    if (maxDiff < 0.2) minZoom = 12;
    else if (maxDiff < 0.5) minZoom = 12;
    else if (maxDiff < 1) minZoom = 11;
    else if (maxDiff < 2) minZoom = 10;
    else if (maxDiff < 5) minZoom = 9;
    else if (maxDiff < 10) minZoom = 8;
    else if (maxDiff < 20) minZoom = 5;
    else minZoom = 3;

    const center = [bboxs[0] + lngDiff / 2, bboxs[1] + latDiff / 2];

    return {
      center: center,
      maxZoom,
      minZoom,
      bounds: [
        [bboxs[0], bboxs[1]],
        [bboxs[2], bboxs[3]],
      ],
    };
  };

  return {
    fitBounds,
    getGeohashByNeighbors,
    getGeohashByBounds,
    calculateBestViewForFeatures,
  };
};
