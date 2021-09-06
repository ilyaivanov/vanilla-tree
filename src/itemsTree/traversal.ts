export const forEachChild = (root: Item, action: (item: Item) => void) => {
  const forEachItemAndChildren = (item: Item) => {
    action(item);
    item.children.forEach(forEachItemAndChildren);
  };
  forEachItemAndChildren(root);
};
