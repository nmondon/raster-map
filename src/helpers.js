import { geoProjection } from "d3-geo";
import proj4 from "proj4";

// proj4d3() is a function developped by @fil. See https://observablehq.com/@fil/proj4js-d3
// https://observablehq.com/@neocartocnrs/map-template-france-lambert-93
function proj4d3(proj4string) {
  const degrees = 180 / Math.PI,
    radians = 1 / degrees,
    raw = proj4(proj4string),
    p = function (lambda, phi) {
      return raw.forward([lambda * degrees, phi * degrees]);
    };
  p.invert = function (x, y) {
    return raw.inverse([x, y]).map(function (d) {
      return d * radians;
    });
  };
  const projection = geoProjection(p).scale(1);
  // @ts-ignore
  projection.raw = raw;
  return projection;
}

export const getLambert93Projection = () => {
  return proj4d3(
    "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
  );
};
