import { viewTree } from "./tree";
import { createItem, createRoot, randomItems } from "./itemsTree";

const root: Item = createRoot("Home", [
  createItem("Music", randomItems(10)),
  createItem("Software Development", [
    createItem("Front-End", randomItems(3)),
    createItem("Back-End", randomItems(2)),
  ]),
  createItem("People", randomItems(12)),
  createItem("Channels", randomItems(5)),
]);

//@ts-expect-error
global.root = root;
document.body.appendChild(viewTree(root));
