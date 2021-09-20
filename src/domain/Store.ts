import { insertAt, removeItem } from "./core";
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
    this.mutations.removeItem(itemSelected);
    this.changeSelection(
      !itemAbove || isRoot(itemAbove) ? this.root.children[0] : itemAbove
    );
  };

  createItemAfterSelection = () => {
    const itemSelected = this.selectedItem;
    const parent = itemSelected.parent;
    if (parent) {
      const newItem = createItem("");
      const index = parent.children.indexOf(itemSelected);
      this.mutations.addItemAt(parent, newItem, index);
      this.changeSelection(newItem);
      this.startRenamingSelected();
    }
  };

  startRenamingSelected = () => {
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

  mutations = {
    addItemAt: (parent: Item, newItem: Item, index: number) => {
      insertAt(parent, newItem, index);
      this.events.trigger("added", newItem);
    },
    removeItem: (item: Item) => {
      removeItem(item);
      this.events.trigger("removed", item);
    },
  };

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
