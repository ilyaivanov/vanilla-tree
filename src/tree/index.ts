import { dom } from "../infra";
import { style } from "../infra/styles/style";
import { ItemViewEvents, listenToKeyboardEvents } from "./eventsController";

const map = new WeakMap<Item, ItemViewEvents>();

export const viewTree = (root: Item): Element => {
  requestAnimationFrame(() => {
    listenToKeyboardEvents(map, root);
  });
  return ItemView.viewItem(root);
};

class ItemView implements ItemViewEvents {
  el: HTMLElement;
  text: HTMLSpanElement;
  children?: HTMLElement;

  constructor(private item: Item) {
    this.text = dom.span({ textContent: item.title });
    this.children = this.viewChildren();
    this.el = dom.div({}, [
      dom.div({ className: "item-row" }, [
        dom.span({ className: "item-circle" }),
        this.text,
      ]),
      this.children,
    ]);
    map.set(item, this);
  }

  close() {
    this.children?.remove();
    this.children = undefined;
  }

  open() {
    this.children = this.viewChildren();
    if (this.children) dom.appendChild(this.el, this.children);
  }

  select() {
    dom.addClass(this.text, "item-selected");
  }

  unselect() {
    dom.removeClass(this.text, "item-selected");
  }

  viewChildren() {
    if (this.item.isOpen && this.item.children.length)
      return dom.div(
        { className: "item-children" },
        this.item.children.map(ItemView.viewItem)
      );
    return undefined;
  }

  static viewItem = (item: Item) => new ItemView(item).el;
}

style.class("item-selected", {
  color: "red",
});

const circleSize = 6;
const step = 25;
const borderWidth = 2;

const marginLeft = circleSize / 2 - borderWidth / 2;

style.class("item-children", {
  marginLeft: marginLeft,
  paddingLeft: step - marginLeft,
  borderLeft: `${borderWidth}px solid #4C5155`,
});

style.class("item-circle", {
  width: circleSize,
  height: circleSize,
  borderRadius: 4,
  backgroundColor: "white",
  display: "inline-block",
  marginRight: 5,
});

style.class("item-row", {
  display: "flex",
  alignItems: "center",
});
