export const removeItem = (item: Item) => {
  const parent = item.parent;
  if (parent) {
    parent.children = parent.children.filter((child) => child !== item);
  }
};

export const insertAt = (
  parent: Item | undefined,
  newItem: Item,
  index: number
) => {
  if (parent) {
    newItem.parent = parent;
    parent.children.splice(index + 1, 0, newItem);
  }
};
