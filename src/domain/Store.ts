import { Events } from "./core";
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

  openItem(item: Item) {
    item.isOpen = true;
    this.events.trigger("open", item);
  }

  closeItem(item: Item) {
    item.isOpen = false;
    this.events.trigger("close", item);
  }

  events = new Events<ItemEvents>();
  onItemClosed = (cb: Action<Item>) => this.events.on("close", cb);

  onItemOpened = (cb: Action<Item>) => this.events.on("open", cb);

  onSelectionChanged = (cb: Action2<Item, Item>) =>
    this.events.on("selectionChanged", cb);

  offSelectionChanged(cb: Action2<Item, Item>) {
    this.events.off("selectionChanged", cb);
  }

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
  close: (prev: Item) => void;
  open: (prev: Item) => void;
  selectionChanged: (prev: Item, next: Item) => void;
};
