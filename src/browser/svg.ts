type RectProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
};
export const rect = (props: RectProps) => assignProps(svgElem("rect"), props);

type CircleProps = {
  cx?: number;
  cy?: number;
  r: number;
  fill: string;
  stroke?: string;
  "stroke-width"?: number;
};

export const circle = (props: CircleProps) =>
  assignProps(svgElem("circle"), props);

export const updateCircle = (
  circle: SVGCircleElement,
  props: Partial<CircleProps>
) => assignProps(circle, props);

type TextProps = {
  x?: number;
  y?: number;
  dy?: string;
  fill?: string;
  "font-size"?: number;
  "font-weight"?: number;
  contentEditable?: boolean;
};
export const text = (text: string, props: TextProps) => {
  const result = assignProps(svgElem("text"), props);

  result.textContent = text;
  return result;
};

export const updateText = (textElem: SVGTextElement, props: TextProps) =>
  assignProps(textElem, props);

type PathProps = {
  d: string;
  stroke?: string;
  "stroke-width"?: number;
  fill?: string;
};
export const path = (props: PathProps) => assignProps(svgElem("path"), props);

type ForeignObjectProps = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export const foreignObject = (
  props: ForeignObjectProps,
  children?: ChildSvgElements
) => {
  const result = assignProps(svgElem("foreignObject"), props);
  appendChildren(result, children);
  return result;
};

type GProps = {
  transform?: string;
};
export const g = (props: GProps, children?: ChildSvgElements) => {
  const result = assignProps(svgElem("g"), props || {});
  appendChildren(result, children);
  return result;
};

type SVGProps = {
  viewBox: string;
  width: number;
  height: number;
};
export const svg = (props: SVGProps, children?: ChildSvgElements) => {
  const result = assignProps(svgElem("svg"), props || {});
  appendChildren(result, children);
  return result;
};

export const svgStyle = {
  translate: (x: number, y: number) => `translate(${x} ${y})`,
};

//PRIVATE utils
type ChildSvgElements = SVGElement | (SVGElement | undefined)[];

const appendChildren = (node: SVGElement, children?: ChildSvgElements) => {
  if (children) {
    if (Array.isArray(children))
      children.forEach((child) => child && node.appendChild(child));
    else node.appendChild(children);
  }
};

const assignProps = <T extends SVGElement>(rect: T, props: {}): T => {
  Object.entries(props).map(([key, value]) =>
    rect.setAttribute(key, value + "")
  );
  return rect;
};

const svgNamespace = "http://www.w3.org/2000/svg";
const svgElem = <T extends keyof SVGElementTagNameMap>(name: T) =>
  document.createElementNS(svgNamespace, name) as SVGElementTagNameMap[T];
