import * as traversal from "../itemsTree/traversal";
import { ItemView } from "./ItemView";

export const listenToKeyboardEvents = (
  map: WeakMap<Item, ItemView>,
  root: Item
) => {
  let selectedItem = root;
  map.get(root)?.select();

  const selectItem = (item: Item) => {
    map.get(selectedItem)?.unselect();
    selectedItem = item;
    map.get(selectedItem)?.select();
  };

  const updateIndexes = (selectedItem: Item) => {
    let currentGlobalIndex = selectedItem.globalIndex + 1;

    traversal.forEachItemBelow(selectedItem, (item) => {
      item.globalIndex = currentGlobalIndex++;
      console.log(item.title, item.isOpen);
      map.get(item)?.updatePositionInTree();
    });
  };

  document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowDown") {
      const itemBelow = traversal.getItemBelow(selectedItem);
      if (itemBelow) selectItem(itemBelow);
    }
    if (e.code === "ArrowUp") {
      const itemAbove = traversal.getItemAbove(selectedItem);
      if (itemAbove) selectItem(itemAbove);
    }
    if (e.code === "ArrowLeft") {
      if (selectedItem.isOpen) {
        selectedItem.isOpen = false;
        map.get(selectedItem)?.close();
        updateIndexes(selectedItem);
      } else if (selectedItem.parent) {
        selectItem(selectedItem.parent);
      }
    }
    if (e.code === "ArrowRight") {
      if (!selectedItem.isOpen) {
        selectedItem.isOpen = true;
        updateIndexes(selectedItem);
        map.get(selectedItem)?.open();
      } else if (selectedItem.children.length > 0) {
        selectItem(selectedItem.children[0]);
      }
    }
  });
};
