import { fromLonLat, transform } from '../3rdparty/openlayers/src/ol/proj.js';
import { gettersetter } from '../lib/misc.js';

export const lonlatProjection = 'EPSG:4326';
export const webMercatorProjection = 'EPSG:3857';

export function Hash(obj) {
  return Object.setPrototypeOf(obj, null);
}

/* Convert from/to reversed EPSG:4326 */
export function LatLon(lat, lon, proj) {
  if(Array.isArray(lat)) return transform(lat, lon ?? view.getProjection().getCode(), proj ?? 'EPSG:4326').reverse();

  return fromLonLat([lon, lat]);
}

export function Properties(obj, props) {
  const desc = {};
  for(let key in props) {
    const fn = gettersetter(props[key]);
    desc[key] = { get: fn, set: fn, configurable: true };
  }
  return Object.defineProperties(obj, desc);
}
