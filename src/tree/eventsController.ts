import * as traversal from "../itemsTree/traversal";

export type ItemViewEvents = {
  close(): void;
  open(): void;
  select(): void;
  unselect(): void;
};

export const listenToKeyboardEvents = (
  map: WeakMap<Item, ItemViewEvents>,
  root: Item
) => {
  let selectedItem = root;
  map.get(root)?.select();

  const selectItem = (item: Item) => {
    map.get(selectedItem)?.unselect();
    selectedItem = item;
    map.get(selectedItem)?.select();
  };

  document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowDown") {
      e.preventDefault();
      const itemBelow = traversal.getItemBelow(selectedItem);
      if (itemBelow) selectItem(itemBelow);
    }
    if (e.code === "ArrowUp") {
      e.preventDefault();
      const itemAbove = traversal.getItemAbove(selectedItem);
      if (itemAbove) selectItem(itemAbove);
    }
    if (e.code === "ArrowLeft") {
      e.preventDefault();
      if (selectedItem.isOpen) {
        selectedItem.isOpen = false;
        map.get(selectedItem)?.close();
      } else if (selectedItem.parent) {
        selectItem(selectedItem.parent);
      }
    }
    if (e.code === "ArrowRight") {
      e.preventDefault();
      if (!selectedItem.isOpen) {
        selectedItem.isOpen = true;
        map.get(selectedItem)?.open();
      } else if (selectedItem.children.length > 0) {
        selectItem(selectedItem.children[0]);
      }
    }
  });
};
