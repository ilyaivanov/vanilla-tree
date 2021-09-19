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

  store.onSelectionChanged(selectItem);

  selectItem(undefined, store.selectedItem);

  document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowDown") {
      e.preventDefault();
      store.moveSelectionDown();
    }
    if (e.code === "ArrowUp") {
      e.preventDefault();
      store.moveSelectionUp();
    }
    // if (e.code === "ArrowLeft") {
    //   e.preventDefault();
    //   if (selectedItem.isOpen) {
    //     selectedItem.isOpen = false;
    //     map.get(selectedItem)?.close();
    //   } else if (selectedItem.parent) {
    //     selectItem(selectedItem.parent);
    //   }
    // }
    // if (e.code === "ArrowRight") {
    //   e.preventDefault();
    //   if (!selectedItem.isOpen) {
    //     selectedItem.isOpen = true;
    //     map.get(selectedItem)?.open();
    //   } else if (selectedItem.children.length > 0) {
    //     selectItem(selectedItem.children[0]);
    //   }
    // }
  });
};
