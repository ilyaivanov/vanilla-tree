import { ItemView } from "./itemView";
import { store } from "./store";

export const viewTree = (): Element => {
  const map = new WeakMap<Item, ItemView>();

  requestAnimationFrame(() => {
    listenToKeyboardEvents(map);
  });
  return new ItemView(store.root, (view) => map.set(view.item, view)).el;
};

const listenToKeyboardEvents = (map: WeakMap<Item, ItemView>) => {
  const selectionChanged = (prevItem: Item, currentItem: Item) => {
    map.get(prevItem)?.unselect();
    map.get(prevItem.parent!)?.unhighlightChildren();

    map.get(currentItem)?.select();
    map.get(currentItem.parent!)?.highlightChildren();
  };

  store.on("selectionChanged", selectionChanged);
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

  document.addEventListener("keydown", (e) => {
    if (e.code === "KeyE") {
      e.preventDefault();
      store.startRenamingSelected();
    } else if (e.code === "Backspace" && e.ctrlKey && e.shiftKey) {
      e.preventDefault();
      store.removeSelected();
    } else if (e.code === "Enter") {
      e.preventDefault();
      store.createItemAfterSelection();
    } else if (e.code === "ArrowDown" && e.shiftKey && e.altKey) {
      e.preventDefault();
      store.moveSelectedItemBelow();
    } else if (e.code === "ArrowUp" && e.shiftKey && e.altKey) {
      e.preventDefault();
      store.moveSelectedItemAbove();
    } else if (e.code === "ArrowDown") {
      e.preventDefault();
      store.selectItemBelow();
    } else if (e.code === "ArrowUp") {
      e.preventDefault();
      store.selectItemAbove();
    } else if (e.code === "ArrowLeft") {
      e.preventDefault();
      if (store.selectedItem.isOpen) store.closeItem(store.selectedItem);
      else store.selectParent();
    } else if (e.code === "ArrowRight") {
      e.preventDefault();
      if (!store.selectedItem.isOpen) store.openItem(store.selectedItem);
      else store.selectChild();
    }
  });
};
