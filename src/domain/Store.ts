import { insertAt, removeItem } from "./core";
import { createItem } from "./create";
import { Events } from "./events";
import { getItemBelow, getItemAbove, getFirstChild, isRoot } from "./traversal";

export class Store {
  public selectedItem: Item;
  constructor(public root: Item) {
    this.selectedItem = root.children[0];
  }

  selectItemBelow = () =>
    this.mutations.changeSelection(getItemBelow(this.selectedItem));

  selectItemAbove = () =>
    this.mutations.changeSelection(getItemAbove(this.selectedItem));

  selectParent = () => this.mutations.changeSelection(this.selectedItem.parent);

  selectChild = () =>
    this.mutations.changeSelection(getFirstChild(this.selectedItem));

  selectFirstChild = () =>
    this.mutations.changeSelection(this.selectedItem.parent);

  selectItem = (item: Item) => this.mutations.changeSelection(item);

  removeSelected = () => {
    const itemSelected = this.selectedItem;
    const itemAbove = getItemAbove(itemSelected);
    this.mutations.removeItem(itemSelected);
    this.mutations.changeSelection(
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
      this.mutations.changeSelection(newItem);
      this.startRenamingSelected();
    }
  };

  startRenamingSelected = () => this.mutations.startRenamingSelected();

  openItem(item: Item) {
    this.mutations.openItem(item);
  }

  closeItem(item: Item) {
    this.mutations.closeItem(item);
  }

  //Movement
  moveSelectedItemBelow = () => {
    const { parent } = this.selectedItem;
    if (parent) {
      const index = parent.children.indexOf(this.selectedItem);
      if (index < parent.children.length - 1) {
        this.mutations.removeItem(this.selectedItem);
        this.mutations.addItemAt(parent, this.selectedItem, index);
      }
    }
  };

  moveSelectedItemAbove = () => {
    const { parent } = this.selectedItem;
    if (parent) {
      const index = parent.children.indexOf(this.selectedItem);
      if (index > 0) {
        this.mutations.removeItem(this.selectedItem);
        parent.children.splice(index - 1, 0, this.selectedItem);
        this.events.trigger("added", this.selectedItem);
      }
    }
  };

  //Mutations
  mutations = {
    addItemAt: (parent: Item, newItem: Item, index: number) => {
      insertAt(parent, newItem, index);
      this.events.trigger("added", newItem);
    },
    removeItem: (item: Item) => {
      removeItem(item);
      this.events.trigger("removed", item);
    },
    changeSelection: (newItemSelected: Item | undefined) => {
      if (newItemSelected && !isRoot(newItemSelected)) {
        const previouslySelectedItem = this.selectedItem;
        this.selectedItem = newItemSelected;
        this.events.trigger(
          "selectionChanged",
          previouslySelectedItem,
          this.selectedItem
        );
      }
    },
    startRenamingSelected: () => {
      this.events.trigger("startRenaming", this.selectedItem);
    },

    openItem: (item: Item) => {
      item.isOpen = true;
      this.events.trigger("open", item);
    },

    closeItem: (item: Item) => {
      item.isOpen = false;
      this.events.trigger("close", item);
    },
  };

  private events = new Events<ItemEvents>();
  on = this.events.on;
  off = this.events.off;
}

type ItemEvents = {
  close: Action<Item>;
  open: Action<Item>;
  removed: Action<Item>;
  added: Action<Item>;
  startRenaming: Action<Item>;
  selectionChanged: (prev: Item, next: Item) => void;
};
