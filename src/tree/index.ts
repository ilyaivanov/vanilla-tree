import { svg } from "../infra";
import { colors, spacings } from "./constants";

export const viewTree = (root: Item): SVGSVGElement => {
  const height = window.innerHeight;
  const width = window.innerWidth;
  return svg.svg(
    { viewBox: `0 0 ${width} ${height}`, width, height },
    viewItem(root)
  );
};

const viewItem = (item: Item): SVGElement =>
  svg.g({ transform: getItemTransform(item) }, [
    svg.path({
      d: svgPath(item),
      "stroke-width": strokeWidth,
      stroke: colors.lines,
      fill: "none",
    }),
    svg.circle({ r: spacings.circleRadius, fill: colors.circle }),
    svg.text(item.title, {
      dy: "0.32em",
      x: spacings.circleRadius + spacings.distanceBetweenTextAndCircle,
      fill: colors.textRegular,
    }),

    svg.g({}, item.children.map(viewItem)),
  ]);

const getItemTransform = (item: Item): string => {
  //TODO: check if in focus
  if (!item.parent) return `translate(${spacings.rootGap},${spacings.rootGap})`;
  else {
    const rowsFromParent = item.globalIndex - item.parent.globalIndex;
    const x = spacings.horizontalDistanceBetweenItems;
    const y = rowsFromParent * spacings.verticalDistanceBetweenItemCenters;
    return `translate(${x},${y})`;
  }
};

//this 0.5 offset creates a clear separation for 1-pixel sized lines
//it depends upon the stroke
const strokeWidth: number = 2;
const strokeOffset = strokeWidth == 1 ? 0.5 : 0;
const svgPath = (item: Item): string =>
  item.parent
    ? `M0,${strokeOffset}H-${
        spacings.horizontalDistanceBetweenItems + strokeOffset
      }V-${
        (item.globalIndex! - item.parent.globalIndex!) *
          spacings.verticalDistanceBetweenItemCenters -
        spacings.circleRadius
      }`
    : "";
