import { svg } from "../infra";
import { listenToKeyboardEvents } from "./eventsController";
import { ItemView } from "./ItemView";

//idea - move all SVG and contansts to view, at controller just coordinate
//do we need an item controller? Not for now since eventsController handling input
//and we have treeController to dispatch events

export const viewTree = (root: Item): SVGSVGElement => {
  const height = window.innerHeight;
  const width = window.innerWidth;

  const map = new WeakMap<Item, ItemView>();

  const onView: OnView = (item, actions) => map.set(item, actions);
  const result = svg.svg(
    { viewBox: `0 0 ${width} ${height}`, width, height },
    new ItemView(root, 0, onView).el
  );

  listenToKeyboardEvents(map, root);
  return result;
};

type OnView = (item: Item, action: ItemView) => void;
