import { createItem, createRoot, randomItems } from ".";
import { getItemOffsetFromParent } from "./traversal";

const root: Item = createRoot("Home", [
  createItem("Music", randomItems(10)),
  createItem("Software Development", [
    createItem("Front-End", randomItems(3)),
    createItem("Back-End", randomItems(2)),
  ]),
  createItem("People", randomItems(12)),
  createItem("Channels", randomItems(5)),
]);

it("Music has offsef ot 1", () => {
  areEqual(getItemOffsetFromParent(root.children[0]), 1);
});

it("People has offset of ", () => {
  areEqual(getItemOffsetFromParent(root.children[2]), 20);
});
