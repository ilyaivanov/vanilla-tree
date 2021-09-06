import { svg } from "./infra";

export const viewTree = (): SVGSVGElement => {
  return svg.svg({ viewBox: "0 0 500 500", width: "500", height: "500" }, [
    svg.circle({ cx: 20, cy: 20, r: 50, fill: "black" }),
  ]);
};
