import { forEachChild } from "./traversal";

const randomName = (index: number) => "Item " + index;

export const createItem = (title: string, children: Item[] = []): Item => {
  const item: Item = {
    title,
    children,
    globalIndex: 0,
    isOpen: children.length > 0,
  };

  if (children.length > 0) children.forEach((child) => (child.parent = item));
  return item;
};

export const createRoot = (title: string, children: Item[]): Item => {
  const result = createItem(title, children);

  result.globalIndex = 0;
  let index = 1;
  forEachChild(result, (item) => (item.globalIndex = index++));
  return result;
};

export const randomItems = (count: number): Item[] =>
  Array.from(new Array(count)).map((_, i) => createItem(randomName(i + 1)));
