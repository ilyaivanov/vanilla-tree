import { colors, spacings } from "./constants";
import { svg } from "../infra";
import { getItemOffsetFromParent } from "../itemsTree/traversal";

type OnView = (item: Item, action: ItemView) => void;

export class ItemView {
  el: SVGElement;

  path: SVGPathElement;
  circle: SVGCircleElement;
  text: SVGTextElement;
  children?: SVGGElement;

  constructor(
    private item: Item,
    private focusLevel: number,
    private onView: OnView
  ) {
    this.path = viewElements.path(item);
    this.text = viewElements.text(item, focusLevel);
    this.circle = viewElements.circle();
    this.children = this.viewChildren();
    this.el = svg.g({ transform: getItemTransform(item) }, [
      this.path,
      this.circle,
      this.text,
      this.children,
    ]);

    this.onView(item, this);
  }

  select = () => {
    svg.updateText(this.text, { fill: colors.selectedItemFontColor });
    svg.updateCircle(this.circle, { fill: colors.selectedItemFontColor });
  };

  unselect = () => {
    svg.updateText(this.text, { fill: colors.textRegular });
    svg.updateCircle(this.circle, { fill: colors.circle });
  };

  close = () => {
    gsap.to(this.children, {
      opacity: 0,
      onComplete: () => {
        this.children?.remove();
        this.children = undefined;
      },
    });
  };

  open = () => {
    this.children = this.viewChildren();
    if (this.children) {
      this.el.appendChild(this.children);
      gsap.fromTo(this.children, { opacity: 0 }, { opacity: 1 });
    }
  };

  updatePositionInTree = () => {
    gsap.to(this.el, {
      attr: {
        transform: getItemTransform(this.item),
      },
    });
    gsap.to(this.path, {
      attr: { d: svgPath(this.item) },
    });
  };

  private viewChildren = (): SVGGElement | undefined => {
    const { item, focusLevel, onView } = this;
    if (item.isOpen && item.children.length > 0) {
      return viewElements.children(
        item.children.map(
          (item) => new ItemView(item, focusLevel + 1, onView).el
        )
      );
    } else {
      return undefined;
    }
  };
}

const viewElements = {
  path: (item: Item) =>
    svg.path({
      d: svgPath(item),
      "stroke-width": strokeWidth,
      stroke: colors.lines,
      fill: "none",
    }),

  text: (item: Item, focusLevel: number) =>
    svg.text(item.title, {
      dy: "0.32em",
      "font-size": focusLevel == 0 || focusLevel == 1 ? 18 : undefined,
      "font-weight": focusLevel == 0 ? 600 : focusLevel == 1 ? 500 : undefined,
      x: spacings.circleRadius + spacings.distanceBetweenTextAndCircle,
      fill: colors.textRegular,
    }),

  circle: () => svg.circle({ r: spacings.circleRadius, fill: colors.circle }),

  children: (nodes: SVGElement[]) => svg.g({}, nodes),
};

const getItemTransform = (item: Item): string => {
  let position: Vector;
  //TODO: check if in focus
  if (!item.parent) {
    position = { x: spacings.rootGap, y: spacings.rootGap };
  } else {
    const x = spacings.horizontalDistanceBetweenItems;
    const y =
      getItemOffsetFromParent(item) *
      spacings.verticalDistanceBetweenItemCenters;
    position = { x, y };
  }
  return `translate(${position.x},${position.y})`;
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
        getItemOffsetFromParent(item) *
          spacings.verticalDistanceBetweenItemCenters -
        spacings.circleRadius
      }`
    : "";
