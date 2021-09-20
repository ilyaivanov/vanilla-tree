import { Store } from "../domain/Store";
import { ItemView } from "./itemView";

export const viewTree = (store: Store): Element => {
  const map = new WeakMap<Item, ItemView>();

  requestAnimationFrame(() => {
    listenToKeyboardEvents(map, store);
  });
  return new ItemView(store.root, (view) => map.set(view.item, view)).el;
};

const listenToKeyboardEvents = (map: WeakMap<Item, ItemView>, store: Store) => {
  const selectItem = (prevItem: Item | undefined, currentItem: Item) => {
    map.get(prevItem!)?.unselect();
    map.get(prevItem?.parent!)?.unhighlightChildren();

    map.get(currentItem)?.select();
    map.get(currentItem.parent!)?.highlightChildren();
  };

  store.on("selectionChanged", selectItem);
  store.on("close", (item) => map.get(item)?.close());
  store.on("open", (item) => map.get(item)?.open());
  store.on("removed", (item) => map.get(item)?.remove());
  store.on("startRenaming", (item) => map.get(item)?.startRenaming());

  store.on("added", (item) => {
    const parent = item.parent;
    if (parent) {
      const index = parent.children.indexOf(item);
      map.get(parent)?.insertItemAt(item, index);
    }
  });

  selectItem(undefined, store.selectedItem);

  document.addEventListener("keydown", (e) => {
    if (e.code === "KeyE") {
      e.preventDefault();
      store.startRenamingSelected();
    }
    if (e.code === "Backspace" && e.ctrlKey && e.shiftKey) {
      e.preventDefault();
      store.removeSelected();
    }
    if (e.code === "Enter") {
      e.preventDefault();
      store.createItemAfterSelection();
    }
    if (e.code === "ArrowDown") {
      e.preventDefault();
      store.selectItemBelow();
    }
    if (e.code === "ArrowUp") {
      e.preventDefault();
      store.selectItemAbove();
    }
    if (e.code === "ArrowLeft") {
      e.preventDefault();
      if (store.selectedItem.isOpen) store.closeItem(store.selectedItem);
      else store.selectParent();
    }
    if (e.code === "ArrowRight") {
      e.preventDefault();
      if (!store.selectedItem.isOpen) store.openItem(store.selectedItem);
      else store.selectChild();
    }
  });
};
