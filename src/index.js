import { Map, View } from '../3rdparty/openlayers/src/ol/index.js';
import { Tile as TileLayer } from '../3rdparty/openlayers/src/ol/layer.js';
import { XYZ } from '../3rdparty/openlayers/src/ol/source.js';
import { defaults as defaultControls, ScaleLine } from '../3rdparty/openlayers/src/ol/control.js';
import { fromLonLat, addCoordinateTransforms, addProjection, transform } from '../3rdparty/openlayers/src/ol/proj.js';
import trkl from '../lib/trkl.js';
import { getset, gettersetter } from '../lib/misc.js';

const locations = Hash({
  buehl: LatLon(46.77558, 7.35901),
  eigerplatz: LatLon(46.94121, 7.43125),
  zuhause: LatLon(46.96482, 7.45433),
  chasseral: LatLon(47.1332, 7.06032),
  bantiger: LatLon(46.97771, 7.52866),
  felsenausteg: LatLon(46.96552, 7.44496),
  botanischergarten: LatLon(46.95302, 7.44489),
  ulmizberg: LatLon(46.90036, 7.43421),
  hinterkappelen: LatLon(46.96787, 7.3774),
  glasbrunnen: LatLon(46.96186208844483, 7.411693012341456)
});

const backgroundLayer = new TileLayer({ id: 'background-layer', source: new XYZ({ url: `https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg` }) });

const view = new View({ projection: 'EPSG:3857', center: locations.zuhause, zoom: 16 });

const map = new Map({ target: 'map', controls: defaultControls().extend([new ScaleLine({ units: 'metric' })]), layers: [backgroundLayer], view });

Properties(globalThis, {
  zoom: [() => view.getZoom(), v => view.setZoom(v)],
  rotation: [() => view.getRotation(), v => view.setRotation(v)],
  resolution: [() => view.getResolution(), v => view.setResolution(v)],
  projection: [() => view.getProjection()],
  center: [() => view.getCenter(), v => view.setCenter(v)]
});

const ol = { Map, View, TileLayer, XYZ, defaultControls, ScaleLine, fromLonLat, addCoordinateTransforms, addProjection, transform };

Object.assign(globalThis, { ol, view, map, backgroundLayer, LatLon, locations, trkl, getset, gettersetter });

function Hash(obj) {
  return Object.setPrototypeOf(obj, null);
}

function LatLon(lat, lon) {
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
