import { createItem } from "./create";
import { getItemAbove, getItemBelow } from "./traversal";

describe("Having one root with two children", () => {
  let root: Item;

  let child1: Item;
  let child1_1: Item;
  let child2: Item;

  beforeEach(() => {
    child1_1 = createItem("Child 1_1");
    child1 = createItem("Child 1", [child1_1]);
    child2 = createItem("Child 1");
    root = createItem("Home", [child1, child2]);
  });

  it("assigns parent to children", () => {
    expect(child1.parent).toBe(root);
    expect(child1_1.parent).toBe(child1);
    expect(child2.parent).toBe(root);
  });

  it("getting item below first child returns second child", () =>
    expect(getItemBelow(child1_1)).toBe(child2));

  it("getting item below second child returns undefined", () =>
    expect(getItemBelow(child2)).toBe(undefined));

  it("getting item above second child returns child1_1", () =>
    expect(getItemAbove(child2)).toBe(child1_1));

  it("getting item above first child returns root", () =>
    expect(getItemAbove(child1)).toBe(root));
});
