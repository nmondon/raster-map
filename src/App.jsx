import useSWR from "swr";
import { geoPath } from "d3-geo";
import rewind from "@turf/rewind";
import { Suspense, useMemo } from "react";
import { getLambert93Projection } from "./helpers";

const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((d) => rewind(d, { reverse: true }));

const width = 700,
  height = 700,
  margin = 20;

const sizes = {
  w: width - 2 * margin,
  h: height - 2 * margin,
};

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chart />
    </Suspense>
  );
}

function Chart() {
  const { data: departements } = useSWR("./departements.geojson", fetcher, {
    suspense: true,
  });

  const geo = useMemo(() => {
    const projection = getLambert93Projection().fitSize(
      [sizes.w, sizes.h],
      departements
    );
    const path = geoPath(projection);
    const extent = path.bounds(departements);

    const franceSizes = {
      x: extent[0][0],
      y: extent[0][1],
      width: extent[1][0] - extent[0][0],
      height: extent[1][1] - extent[0][1],
    };

    return {
      projection,
      path,
      extent,
      franceSizes,
    };
  }, [departements, sizes]);

  return (
    <div className="map">
      <h1>Une carte SVG en Lambert 93 avec un fond de carte</h1>
      <svg
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margin}, ${margin})`}>
          <image href="./elevation.jpeg" {...geo.franceSizes} />
          <path
            d={geo.path(departements)}
            fill="none"
            stroke="white"
            vectorEffect={"non-scaling-stroke"}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}

export default App;
