import { colors, fontSizes, spacings } from "../designSystem";
import { dom } from "../browser";
import { style } from "../browser/styles/style";
import { isRoot, isChildrenVisible } from "../domain/traversal";

export class ItemView {
  el: HTMLElement;
  row: HTMLElement;
  text: HTMLElement;
  children?: HTMLElement;

  constructor(
    public item: Item,
    private onView: Action<ItemView>,
    private level: number = 0
  ) {
    this.text = dom.div({ className: "item-rowText", textContent: item.title });
    this.row = dom.div(
      {
        className: "item-row",
        classMap: { "item-row-focused-child": level === 1 },
      },
      [dom.span({ className: "item-circle" }), this.text]
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

  remove() {
    this.el.remove();
  }

  insertItemAt(item: Item, index: number) {
    if (this.children) {
      const el = new ItemView(item, this.onView, this.level + 1).el;
      if (index === 0) {
        this.children.appendChild(el);
      } else {
        this.children.children[index - 1].insertAdjacentElement("afterend", el);
      }
    }
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

  startRenaming = () => {
    const text = this.text;

    text.setAttribute("contenteditable", "");
    text.addEventListener("blur", this.onBlur);
    text.addEventListener("keydown", this.onKeyDown);
    text.focus();

    var range = document.createRange();
    var sel = window.getSelection();

    if (sel) {
      range.setStart(text, 0);
      range.collapse(true);

      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  private endRename = () => {
    this.text.removeAttribute("contenteditable");
    this.text.removeEventListener("blur", this.onBlur);
    this.text.removeEventListener("keydown", this.onKeyDown);
    //TODO: will need to notify store to update other parts of UI
    this.item.title = this.text.textContent || "";
  };

  private onKeyDown = (e: KeyboardEvent) => {
    //to avoid selection change
    e.stopPropagation();

    if (e.code === "Enter" || e.code === "Escape") {
      this.endRename();
    }
  };

  private onBlur = () => this.endRename();

  private viewChildren() {
    if (isChildrenVisible(this.item))
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
  minWidth: spacings.circleSize,
  width: spacings.circleSize,
  height: spacings.circleSize,
  borderRadius: spacings.circleSize / 2,
  backgroundColor: colors.circle,
  display: "inline-block",
  marginRight: spacings.distanceBetweenTextAndCircle,

  //picked by hand to center circle across text. probably better to fix this
  marginTop: "0.35em",
});

style.class("item-row", {
  paddingTop: spacings.itemPadding,
  paddingBottom: spacings.itemPadding,
  display: "flex",

  //this margin\padding is used to extends selection background color
  marginLeft: -spacings.xStep / 2,
  paddingLeft: spacings.xStep / 2,
});

style.class("item-row-focused-child", {
  fontSize: fontSizes.big,
});

style.class("item-rowText", {
  outline: "none",
});
