export const forEachChild = (root: Item, action: (item: Item) => void) => {
  const forEachItemAndChildren = (item: Item) => {
    action(item);
    if (item.isOpen) item.children.forEach(forEachItemAndChildren);
  };
  root.children.forEach(forEachItemAndChildren);
};

export const forEachItemBelow = (item: Item, action: (item: Item) => void) => {
  let parent: Item | undefined = item.parent;
  let currentItem: Item = item;
  if (item.isOpen) forEachChild(item, action);
  while (parent) {
    getArrayElementsAfter(parent.children!, currentItem).forEach(action);
    currentItem = parent;
    parent = parent.parent;
  }
};

//this goes down into children
export const getItemBelow = (item: Item): Item | undefined => {
  if (item.isOpen && item.children) return item.children![0];

  const followingItem = getFollowingItem(item);
  if (followingItem) return followingItem;
  else {
    let parent: Item | undefined = item.parent;
    while (parent && isLast(parent)) {
      parent = parent.parent;
    }
    if (parent) return getFollowingItem(parent);
  }
};

export const getItemAbove = (item: Item): Item | undefined => {
  const previous = getPreviousItem(item);
  if (previous && previous.isOpen) return getLastNestedItem(previous);
  else if (previous) return previous;
  else if (item.parent) return item.parent;
};

//this always returns following item without going down to children
export const getFollowingItem = (item: Item): Item | undefined => {
  const parent = item.parent;
  if (parent) {
    const context: Item[] = parent.children!;
    const index = context.indexOf(item);
    if (index < context.length - 1) {
      return context[index + 1];
    }
  }
};
// //this always returns following item without going down to children
export const getPreviousItem = (item: Item): Item | undefined => {
  const parent = item.parent;
  if (parent) {
    const context: Item[] = parent.children!;
    const index = context.indexOf(item);
    if (index > 0) {
      return context[index - 1];
    }
  }
};

export const getLastNestedItem = (item: Item): Item => {
  if (item.isOpen && item.children) {
    const { children } = item;
    return getLastNestedItem(children[children.length - 1]);
  }
  return item;
};

export const getFirstChild = (item: Item): Item | undefined => {
  const { children } = item;
  if (children && children.length > 0) return children[0];
  return undefined;
};

export const isLast = (item: Item): boolean => !getFollowingItem(item);

export const isRoot = (item: Item): boolean => {
  return !item.parent;
};

const getArrayElementsAfter = <T>(arr: T[], val: T) => {
  const index = arr.findIndex((i) => i == val);
  return arr.slice(index + 1);
};
