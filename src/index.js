import { Map, View } from '../3rdparty/openlayers/src/ol/index.js';
import { Tile as TileLayer, Vector as VectorLayer } from '../3rdparty/openlayers/src/ol/layer.js';
import { XYZ, Vector as VectorSource } from '../3rdparty/openlayers/src/ol/source.js';
import { defaults as defaultControls, ScaleLine } from '../3rdparty/openlayers/src/ol/control.js';
import { addCoordinateTransforms, addProjection, transform, useGeographic, fromLonLat, toLonLat } from '../3rdparty/openlayers/src/ol/proj.js';

import { GeoJSON } from '../3rdparty/openlayers/src/ol/format.js';
import { Draw, Modify, Select, Snap } from '../3rdparty/openlayers/src/ol/interaction.js';
//import VectorLayer from '../3rdparty/openlayers/src/ol/layer/Vector.js';

import { Hash, LatLon, Properties, webMercatorProjection, lonlatProjection } from './utils.js';
import locations from './locations.js';
import { WMS_TILE_SIZE, TILEGRID_ORIGIN, TILEGRID_RESOLUTIONS } from './config.js';
import { Fill, Stroke } from '../3rdparty/openlayers/src/ol/style.js';
import Style from '../3rdparty/openlayers/src/ol/style/Style.js';
import { getVectorContext } from '../3rdparty/openlayers/src/ol/render.js';

function transformFeature(feature, src = webMercatorProjection, dst = lonlatProjection) {
  feature = feature.clone();

  feature.getGeometry().transform(src, dst);

  return feature;
}

//useGeographic();
const format = new GeoJSON();

function writeFeature(feature) {
  return format.writeFeature(transformFeature(feature));
}

function readFeature(string) {
  return transformFeature(format.readFeature(string), lonlatProjection, webMercatorProjection);
}

const switzerland = new VectorSource({ url: 'https://transistorisiert.ch/ol-swisstopo/src/switzerland.json', format });

const source = new VectorSource({ format });

const selected = new Style({ fill: new Fill({ color: 'rgba(128, 64, 255, 0.4)' }), stroke: new Stroke({ color: 'rgba(255, 255, 0, 0.7)', width: 2 }) });

function selectStyle(feature) {
  const color = feature.get('COLOR') || '#eeeeee';
  selected.getFill().setColor(color);
  return selected;
}

const clipLayer = new VectorLayer({ style: null, source: switzerland });

const vectorLayer = new VectorLayer({ visible: true, source });

const backgroundLayer = new TileLayer({ id: 'background-layer', source: new XYZ({ url: 'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg' }) });

const swissimageLayer = new TileLayer({ id: 'swissimage-layer', source: new XYZ({ url: 'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg' }) });

//Giving the clipped layer an extent is necessary to avoid rendering when the feature is outside the viewport
/*clipLayer.getSource().on('addfeature', function() {
  swissimageLayer.setExtent(clipLayer.getSource().getExtent());
});*/

const style = new Style({ fill: new Fill({ color: 'black' }) });

/*swissimageLayer.on('postrender', function(e) {
  const vectorContext = getVectorContext(e);
  e.context.globalCompositeOperation = 'destination-in';
  clipLayer.getSource().forEachFeature(function (feature) {
    console.log('feature', feature);
    vectorContext.drawFeature(feature, style);
  });
  e.context.globalCompositeOperation = 'source-over';
});*/

const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));

async function fade(start, end, ms, setter) {
  const steps = ms / 50;

  for(let i = 0; i < steps; i++) {
    const alpha = i / (steps - 1);
    setter(start + (end - start) * alpha);
    await delay(50);
  }
}

const view = new View({ projection: webMercatorProjection, center: locations.bantiger, zoom: 10, 
  extent: [650000, 5740000, 1180000, 6090000] 
});

const map = new Map({
  target: 'map',
  controls: defaultControls().extend([new ScaleLine({ units: 'metric' })]),
  layers: [
    swissimageLayer,
    backgroundLayer,
    vectorLayer,
    clipLayer,
    //,
  ],
  view,
});

const select = new Select({ style: selectStyle });

const modify = new Modify({ features: select.getFeatures() });

const draw = new Draw({ type: 'Polygon', source });

draw.on('drawend', ({ feature, target }) => {
  source.addFeature(feature);

  console.log('drawend', { feature, target });
});
/*draw.on('change', e=>  { 
  console.log('change', e); 
});*/

const snap = new Snap({ source: source });

function removeInteractions() {
  map.removeInteraction(modify);
  map.removeInteraction(select);
  map.removeInteraction(draw);
  map.removeInteraction(select);
}

Properties(globalThis, {
  zoom: [() => view.getZoom(), v => view.setZoom(v)],
  rotation: [() => view.getRotation(), v => view.setRotation(v)],
  resolution: [() => view.getResolution(), v => view.setResolution(v)],
  projection: [() => view.getProjection().getCode()],
  center: [() => view.getCenter(), v => view.setCenter(v)],
  layers: [() => map.getLayers().getArray(), v => v],
  alpha: [() => map.getLayers().getArray()[1].getOpacity(), v => map.getLayers().getArray()[1].setOpacity(v)],
  features: [() => source.getFeatures(), v => v],
});

const ol = { GeoJSON, VectorLayer, Draw, Modify, Select, Snap, Map, View, TileLayer, XYZ, defaultControls, ScaleLine, addCoordinateTransforms, addProjection, transform, useGeographic };

Object.assign(globalThis, {
  fade,
  TILEGRID_RESOLUTIONS,
  TILEGRID_ORIGIN,
  WMS_TILE_SIZE,
  ol,
  view,
  map,
  modify,
  select,
  draw,
  snap,
  source,
  clipLayer,
  backgroundLayer,
  vectorLayer,
  switzerland,
  swissimageLayer,
  fromLonLat,
  toLonLat,
  webMercatorProjection,
  lonlatProjection,
  LatLon,
  Hash,
  Properties,
  locations,
  format,
  removeInteractions,
  transformFeature,
  writeFeature,
  readFeature,
});
