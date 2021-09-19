export const removeItem = (item: Item) => {
  const parent = item.parent;
  if (parent) {
    parent.children = parent.children.filter((child) => child !== item);
  }
};
