import { removeItem } from "./core";
import { createItem } from "./create";
import { Events } from "./events";
import { getItemBelow, getItemAbove, getFirstChild, isRoot } from "./traversal";

export class Store {
  public selectedItem: Item;
  constructor(public root: Item) {
    this.selectedItem = root.children[0];
  }

  moveSelectionDown = () =>
    this.changeSelection(getItemBelow(this.selectedItem));

  moveSelectionUp = () => this.changeSelection(getItemAbove(this.selectedItem));

  moveSelectionToParent = () => this.changeSelection(this.selectedItem.parent);

  moveSelectionToFirstChild = () =>
    this.changeSelection(getFirstChild(this.selectedItem));

  selectFirstChild = () => this.changeSelection(this.selectedItem.parent);

  selectItem = (item: Item) => this.changeSelection(item);

  removeSelected = () => {
    const itemSelected = this.selectedItem;
    const itemAbove = getItemAbove(itemSelected);
    removeItem(itemSelected);
    this.changeSelection(
      !itemAbove || isRoot(itemAbove) ? this.root.children[0] : itemAbove
    );
    this.events.trigger("removed", itemSelected);
  };

  createItemAfterSelection = () => {
    const itemSelected = this.selectedItem;
    const parent = itemSelected.parent;
    if (parent) {
      const index = parent.children.indexOf(itemSelected);
      const newItem = createItem("Hello World");
      newItem.parent = parent;
      parent.children.splice(index + 1, 0, newItem);
      this.events.trigger("added", newItem);
      this.changeSelection(newItem);
    }
  };

  startRenaming = () => {
    this.events.trigger("startRenaming", this.selectedItem);
  };

  openItem(item: Item) {
    item.isOpen = true;
    this.events.trigger("open", item);
  }

  closeItem(item: Item) {
    item.isOpen = false;
    this.events.trigger("close", item);
  }

  private events = new Events<ItemEvents>();
  on = this.events.on;
  off = this.events.off;

  private changeSelection(newItemSelected: Item | undefined) {
    if (newItemSelected && !isRoot(newItemSelected)) {
      const previouslySelectedItem = this.selectedItem;
      this.selectedItem = newItemSelected;
      this.events.trigger(
        "selectionChanged",
        previouslySelectedItem,
        this.selectedItem
      );
    }
  }
}

type ItemEvents = {
  close: Action<Item>;
  open: Action<Item>;
  removed: Action<Item>;
  added: Action<Item>;
  startRenaming: Action<Item>;
  selectionChanged: (prev: Item, next: Item) => void;
};
