import { Map, View } from '../3rdparty/openlayers/src/ol/index.js';
import { Tile as TileLayer } from '../3rdparty/openlayers/src/ol/layer.js';
import { XYZ } from '../3rdparty/openlayers/src/ol/source.js';
import { defaults as defaultControls, ScaleLine } from '../3rdparty/openlayers/src/ol/control.js';
import { fromLonLat, addCoordinateTransforms, addProjection, transform } from '../3rdparty/openlayers/src/ol/proj.js';
import trkl from '../lib/trkl.js';

const locations = Hash({
  buehl: Coordinate(46.77558, 7.35901),
  eigerplatz: Coordinate(46.94121, 7.43125),
  zuhause: Coordinate(46.96482, 7.45433)
});

const backgroundLayer = new TileLayer({
  id: 'background-layer',
  source: new XYZ({
    url: `https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg`
  })
});

const view = new View({
  projection: 'EPSG:3857',
  center: locations.zuhause,
  zoom: 16
});

const map = new Map({
  target: 'map',
  controls: defaultControls().extend([
    new ScaleLine({
      units: 'metric'
    })
  ]),
  layers: [backgroundLayer],
  view
});

Properties(globalThis, {
  zoom: [() => view.getZoom(), (value) => view.setZoom(value)],
  rotation: [() => view.getRotation(), (value) => view.setRotation(value)],
  resolution: [() => view.getResolution(), (value) => view.setResolution(value)],
  projection: [() => view.getProjection()],
  center: [() => view.getCenter(), (value) => view.setCenter(value)]
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

Object.assign(globalThis, {
  ol,
  view,
  map,
  backgroundLayer,
  Coordinate,
  locations,
  trkl
});

function Hash(obj) {
  return Object.setPrototypeOf(obj, null);
}

function Coordinate(lat, lon) {
  return fromLonLat([lon, lat]);
}

function Properties(obj, props) {
  const desc = {};
  for (let key in props) {
    const [get, set] = props[key];
    desc[key] = { get, set, configurable: true };
  }
  return Object.defineProperties(obj, desc);
}
