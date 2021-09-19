import { getItemBelow, getItemAbove, isRoot } from "./traversal";

export class Store {
  public selectedItem: Item;
  constructor(public root: Item) {
    this.selectedItem = root.children[0];
  }

  moveSelectionDown() {
    const itemBelow = getItemBelow(this.selectedItem);
    if (itemBelow) this.changeSelection(itemBelow);
  }

  moveSelectionUp() {
    const itemAbove = getItemAbove(this.selectedItem);
    if (itemAbove && !isRoot(itemAbove)) this.changeSelection(itemAbove);
  }

  selectItem(item: Item) {
    this.changeSelection(item);
  }

  openItem(item: Item) {}

  closeItem(item: Item) {}

  //EVENTS
  onSelectionChangedCbs: Action2<Item, Item>[] = [];
  onSelectionChanged(cb: Action2<Item, Item>) {
    this.onSelectionChangedCbs.push(cb);
  }

  offSelectionChanged(cb: Action2<Item, Item>) {
    this.onSelectionChangedCbs = this.onSelectionChangedCbs.filter(
      (c) => c != cb
    );
  }

  private changeSelection(newItemSelected: Item) {
    const previouslySelectedItem = this.selectedItem;
    this.selectedItem = newItemSelected;
    this.onSelectionChangedCbs.forEach((cb) =>
      cb(previouslySelectedItem, this.selectedItem)
    );
  }
}

class Events {
  on(event: string, cb: any) {}
  off(event: string, cb: any) {}
  trigger(event: string, ...args: any[]) {}
}
