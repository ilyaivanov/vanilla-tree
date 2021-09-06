import { svg } from "../infra";
import { spacings } from "./constants";

export const viewTree = (root: Item): SVGSVGElement => {
  const height = window.innerHeight;
  const width = window.innerWidth;
  return svg.svg(
    { viewBox: `0 0 ${width} ${height}`, width, height },
    root.children.map(viewItem)
  );
};

const viewItem = (item: Item, index: number) => {
  const x = (index + 1) * spacings.verticalDistanceBetweenItemCenters;

  return svg.g({ transform: `translate(0, ${x})` }, [
    svg.circle({ cx: 20, r: spacings.circleSize, fill: "grey" }),
    svg.text(item.title, {
      dy: "0.32em",
      x: 20 + spacings.circleSize + spacings.distanceBetweenTextAndCircle,
      fill: "white",
    }),
  ]);
};
