import { viewTree } from "./tree";

//DATA

const randomName = (index: number) => "Item " + index;

const randomItems = (count: number) =>
  Array.from(new Array(count)).map((_, i) => ({
    title: randomName(i + 1),
    children: [],
  }));

const root: Item = {
  title: "Home",
  children: randomItems(20),
};

document.body.appendChild(viewTree(root));
