import { svg } from "../infra";
import { colors, spacings } from "./constants";
import { ItemActions, listenToKeyboardEvents } from "./eventsController";

export const viewTree = (root: Item): SVGSVGElement => {
  const height = window.innerHeight;
  const width = window.innerWidth;

  const map = new WeakMap<Item, ItemActions>();
  const result = svg.svg(
    { viewBox: `0 0 ${width} ${height}`, width, height },
    viewItem(root, 0, (item, actions) => map.set(item, actions))
  );

  listenToKeyboardEvents(map, root);
  return result;
};

type OnView = (item: Item, action: ItemActions) => void;

const viewItem = (
  item: Item,
  focusLevel: number,
  onView: OnView
): SVGElement => {
  const path = svg.path({
    d: svgPath(item),
    "stroke-width": strokeWidth,
    stroke: colors.lines,
    fill: "none",
  });

  const text = svg.text(item.title, {
    dy: "0.32em",
    "font-size": focusLevel == 0 || focusLevel == 1 ? 18 : undefined,
    "font-weight": focusLevel == 0 ? 600 : focusLevel == 1 ? 500 : undefined,
    x: spacings.circleRadius + spacings.distanceBetweenTextAndCircle,
    fill: colors.textRegular,
  });

  const circle = svg.circle({ r: spacings.circleRadius, fill: colors.circle });

  const actions: ItemActions = {
    select: () => {
      text.setAttribute("fill", colors.selectedItemFontColor);
      circle.setAttribute("fill", colors.selectedItemFontColor);
    },

    unselect: () => {
      text.setAttribute("fill", colors.textRegular);
      circle.setAttribute("fill", colors.circle);
    },

    close: () => {
      gsap.to(children, {
        opacity: 0,
        onComplete: () => {
          children?.remove();
          children = undefined;
        },
      });
    },

    open: () => {
      children = viewChildren(item, focusLevel, onView);
      if (children) {
        itemContainer.appendChild(children);
        gsap.fromTo(children, { opacity: 0 }, { opacity: 1 });
      }
    },

    updatePositionInTree: () => {
      gsap.to(itemContainer, {
        attr: { transform: getItemTransformInUnits(item) },
      });
      gsap.to(path, { attr: { d: svgPath(item) } });
    },
  };

  let children = viewChildren(item, focusLevel, onView);

  onView(item, actions);
  const itemContainer = svg.g({ transform: getItemTransformInUnits(item) }, [
    path,
    circle,
    text,
    children,
  ]);
  return itemContainer;
};

const viewChildren = (item: Item, currentLevel: number, onView: OnView) =>
  item.isOpen && item.children.length > 0
    ? svg.g(
        {},
        item.children.map((item) => viewItem(item, currentLevel + 1, onView))
      )
    : undefined;

const getItemTransformInUnits = (item: Item): string => {
  const { x, y } = getItemTransform(item);
  return `translate(${x},${y})`;
};

const getItemTransform = (item: Item): Vector => {
  //TODO: check if in focus
  if (!item.parent) return { x: spacings.rootGap, y: spacings.rootGap };
  else {
    const rowsFromParent = item.globalIndex - item.parent.globalIndex;
    const x = spacings.horizontalDistanceBetweenItems;
    const y = rowsFromParent * spacings.verticalDistanceBetweenItemCenters;
    return { x, y };
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
