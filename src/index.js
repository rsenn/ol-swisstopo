import { Map, View } from '../3rdparty/openlayers/src/ol/index.js';
import { Tile as TileLayer } from '../3rdparty/openlayers/src/ol/layer.js';
import { XYZ } from '../3rdparty/openlayers/src/ol/source.js';
import { defaults as defaultControls, ScaleLine } from '../3rdparty/openlayers/src/ol/control.js';
import { addCoordinateTransforms, addProjection, transform } from '../3rdparty/openlayers/src/ol/proj.js';
import { Hash, LatLon, Properties } from './utils.js';
import locations from './locations.js';

const backgroundLayer = new TileLayer({
  id: 'background-layer',
  source: new XYZ({
    url: 'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg'
  })
});

const swissimageLayer = new TileLayer({
  id: 'swissimage-layer',
  source: new XYZ({
    url: 'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg'
  })
});

const view = new View({ projection: 'EPSG:3857', center: locations.zuhause, zoom: 16 });

const map = new Map({
  target: 'map',
  controls: defaultControls().extend([new ScaleLine({ units: 'metric' })]),
  layers: [swissimageLayer, backgroundLayer],
  view
});

Properties(globalThis, {
  zoom: [() => view.getZoom(), v => view.setZoom(v)],
  rotation: [() => view.getRotation(), v => view.setRotation(v)],
  resolution: [() => view.getResolution(), v => view.setResolution(v)],
  projection: [() => view.getProjection()],
  center: [() => view.getCenter(), v => view.setCenter(v)]
});

const ol = { Map, View, TileLayer, XYZ, defaultControls, ScaleLine, addCoordinateTransforms, addProjection, transform };

Object.assign(globalThis, { ol, view, map, backgroundLayer, LatLon, Hash, Properties, locations });
