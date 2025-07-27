import { Map, View } from '../3rdparty/openlayers/src/ol/index.js';
import { Tile as TileLayer } from '../3rdparty/openlayers/src/ol/layer.js';
import { XYZ } from '../3rdparty/openlayers/src/ol/source.js';
import { defaults as defaultControls, ScaleLine } from '../3rdparty/openlayers/src/ol/control.js';
import { fromLonLat, addCoordinateTransforms, addProjection, transform } from '../3rdparty/openlayers/src/ol/proj.js';
import { getset, gettersetter } from '../lib/misc.js';

const locations = Hash({
  allmend: LatLon(46.96298, 7.47244),
  altenbergsteg: LatLon(46.95027, 7.44859),
  bantiger: LatLon(46.97771, 7.52866),
  botanischergarten: LatLon(46.95302, 7.44489),
  bremgartenhalbinsel: LatLon(46.97499, 7.44573),
  buehl: LatLon(46.77558, 7.35901),
  chasseral: LatLon(47.1332, 7.06032),
  egelsee: LatLon(46.94457, 7.46506),
  eigerplatz: LatLon(46.94121, 7.43125),
  felsenausteg: LatLon(46.96552, 7.44496),
  glasbrunnen: LatLon(46.96186, 7.41169),
  hinterkappelen: LatLon(46.96787, 7.3774),
  lorrainebad: LatLon(46.95825, 7.44223),
  newgraffiti: LatLon(46.96497, 7.45274),
  paulklee: LatLon(46.94892, 7.47385),
  reichenbachfaehre: LatLon(46.9902, 7.45073),
  ulmizberg: LatLon(46.90036, 7.43421),
  wylerbad: LatLon(46.96622, 7.45284),
  zarbar: LatLon(46.94141, 7.42546),
  zuhause: LatLon(46.96482, 7.45433)
});

const backgroundLayer = new TileLayer({
  id: 'background-layer',
  source: new XYZ({
    url: `https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg`
  })
});

const view = new View({ projection: 'EPSG:3857', center: locations.zuhause, zoom: 16 });

const map = new Map({
  target: 'map',
  controls: defaultControls().extend([new ScaleLine({ units: 'metric' })]),
  layers: [backgroundLayer],
  view
});

Properties(globalThis, {
  zoom: [() => view.getZoom(), v => view.setZoom(v)],
  rotation: [() => view.getRotation(), v => view.setRotation(v)],
  resolution: [() => view.getResolution(), v => view.setResolution(v)],
  projection: [() => view.getProjection()],
  center: [() => view.getCenter(), v => view.setCenter(v)]
});

const ol = {
  Map,
  View,
  TileLayer,
  XYZ,
  defaultControls,
  ScaleLine,
  fromLonLat,
  addCoordinateTransforms,
  addProjection,
  transform
};

Object.assign(globalThis, { ol, view, map, backgroundLayer, LatLon, locations, getset, gettersetter });

function Hash(obj) {
  return Object.setPrototypeOf(obj, null);
}

/* Convert from/to reversed EPSG:4326 */
function LatLon(lat, lon, proj) {
  if (Array.isArray(lat)) return transform(lat, lon ?? view.getProjection().getCode(), proj ?? 'EPSG:4326').reverse();

  return fromLonLat([lon, lat]);
}

function Properties(obj, props) {
  const desc = {};
  for (let key in props) {
    const fn = gettersetter(props[key]);
    desc[key] = { get: fn, set: fn, configurable: true };
  }
  return Object.defineProperties(obj, desc);
}
