const randomName = (index: number) => "Item " + index;

export const createItem = (title: string, children: Item[] = []): Item => {
  const item: Item = {
    title,
    children,
    isOpen: children.length > 0,
  };

  if (children.length > 0) children.forEach((child) => (child.parent = item));
  return item;
};

export const randomItems = (count: number): Item[] =>
  Array.from(new Array(count)).map((_, i) => createItem(randomName(i + 1)));
