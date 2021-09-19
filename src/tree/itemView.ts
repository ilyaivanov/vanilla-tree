import { colors, fontSizes, spacings } from "../designSystem";
import { dom } from "../browser";
import { style } from "../browser/styles/style";
import { isRoot } from "../domain/traversal";

export class ItemView {
  el: HTMLElement;
  row: HTMLElement;
  children?: HTMLElement;

  constructor(
    public item: Item,
    private onView: Action<ItemView>,
    private level: number = 0
  ) {
    this.row = dom.div(
      {
        className: "item-row",
        classMap: { "item-row-focused-child": level === 1 },
      },
      [
        dom.span({ className: "item-circle" }),
        dom.span({ textContent: item.title }),
      ]
    );
    this.children = this.viewChildren();
    this.el = isRoot(item)
      ? this.children!
      : dom.div({}, [this.row, this.children]);
    onView(this);
  }

  close() {
    this.children?.remove();
    this.children = undefined;
  }

  open() {
    this.children = this.viewChildren();
    if (this.children) dom.appendChild(this.el, this.children);
  }

  select = () => dom.addClass(this.row, "item-selected");

  unselect = () => dom.removeClass(this.row, "item-selected");

  highlightChildren = () =>
    this.shouldBeHighlighted(this.children) &&
    dom.addClass(this.children, "item-children-highlighted");

  unhighlightChildren = () =>
    this.shouldBeHighlighted(this.children) &&
    dom.removeClass(this.children, "item-children-highlighted");

  private viewChildren() {
    if (this.item.isOpen && this.item.children.length)
      return dom.div(
        { classMap: { "item-children": !isRoot(this.item) } },
        this.item.children.map(
          (child) => new ItemView(child, this.onView, this.level + 1).el
        )
      );
    return undefined;
  }

  private shouldBeHighlighted = (
    child: Element | undefined
  ): child is Element => !isRoot(this.item) && !!child;
}

const marginLeft = spacings.circleSize / 2 - spacings.borderWidth / 2;

style.class("item-selected", {
  backgroundColor: colors.selectionBackground,
});

style.class("item-children", {
  marginLeft: marginLeft,
  paddingLeft: spacings.xStep - marginLeft,
  borderLeft: `${spacings.borderWidth}px solid ${colors.childrenBorder}`,
  transition: "border-left 200ms",
});

style.class("item-children-highlighted", {
  borderLeft: `${spacings.borderWidth}px solid ${colors.childrenBorderHighlighted}`,
});

style.class("item-circle", {
  width: spacings.circleSize,
  height: spacings.circleSize,
  borderRadius: spacings.circleSize / 2,
  backgroundColor: colors.circle,
  display: "inline-block",
  marginRight: spacings.distanceBetweenTextAndCircle,
});

style.class("item-row", {
  paddingTop: spacings.itemPadding,
  paddingBottom: spacings.itemPadding,
  display: "flex",
  alignItems: "center",

  //this margin\padding is used to extends selection background color
  marginLeft: -spacings.xStep / 2,
  paddingLeft: spacings.xStep / 2,
});

style.class("item-row-focused-child", {
  fontSize: fontSizes.big,
});
