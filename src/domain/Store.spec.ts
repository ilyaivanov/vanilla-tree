import { createItem } from "./create";
import { Store } from "./Store";

it("traversing a tree", () => {
  const root = createItem("Home", [
    createItem("Child 1", [createItem("Child 1_1")]),
    createItem("Child 2"),
  ]);

  const store = new Store(root);
  expect(store.selectedItem.title).toEqual("Child 1");

  store.selectItemBelow();
  expect(store.selectedItem.title).toEqual("Child 1_1");

  store.selectItemBelow();
  expect(store.selectedItem.title).toEqual("Child 2");

  store.selectItemBelow();
  expect(store.selectedItem.title).toEqual("Child 2");

  store.selectItemAbove();
  expect(store.selectedItem.title).toEqual("Child 1_1");

  store.selectItemAbove();
  expect(store.selectedItem.title).toEqual("Child 1");

  store.selectItemAbove();
  expect(store.selectedItem.title).toEqual("Child 1");

  store.selectChild();
  expect(store.selectedItem.title).toEqual("Child 1_1");

  store.selectParent();
  expect(store.selectedItem.title).toEqual("Child 1");

  store.selectParent();
  expect(store.selectedItem.title).toEqual("Child 1");
});

it("removing selected item removes it and selects item above", () => {
  const root = createItem("Home", [
    createItem("Child 1", [createItem("Child 1_1")]),
    createItem("Child 2"),
  ]);

  const store = new Store(root);
  store.selectItem(root.children[0].children[0]);

  store.removeSelected();

  expect(root.children[0].children).toHaveLength(0);
  expect(store.selectedItem).toBe(root.children[0]);
});

it("removing first item selects next one", () => {
  const root = createItem("Home", [
    createItem("Child 1", [createItem("Child 1_1")]),
    createItem("Child 2"),
  ]);

  const store = new Store(root);
  store.removeSelected();
  expect(root.children).toHaveLength(1);
  expect(store.selectedItem.title).toBe("Child 2");
});

it("store events", () => {
  const root = createItem("Home", [
    createItem("Child 1"),
    createItem("Child 2"),
  ]);

  const store = new Store(root);

  const closeCb = jest.fn();
  store.on("close", closeCb);
  store.closeItem(root.children[0]);
  expect(closeCb).toHaveBeenCalledWith(root.children[0]);

  const openCb = jest.fn();
  store.on("open", openCb);
  store.openItem(root.children[0]);
  expect(openCb).toHaveBeenCalledWith(root.children[0]);

  const cb = jest.fn();
  store.on("selectionChanged", cb);
  store.selectItemBelow();
  expect(store.selectedItem.title).toEqual("Child 2");

  const previousItem = root.children[0];
  const currentSelected = root.children[1];
  expect(cb).toHaveBeenCalledWith(previousItem, currentSelected);

  store.off("selectionChanged", cb);
  store.selectItemAbove();
});

it("moving selected item below swaps it with item below", () => {
  const root = createItem("Home", [createItem("1"), createItem("2")]);

  const store = new Store(root);
  store.moveSelectedItemBelow();

  expect(root.children.map((i) => i.title)).toEqual(["2", "1"]);
});

it("moving selected item below when it is last does nothing", () => {
  const root = createItem("Home", [createItem("1"), createItem("2")]);

  const store = new Store(root);
  store.selectItem(root.children[1]);
  store.moveSelectedItemBelow();

  expect(root.children.map((i) => i.title)).toEqual(["1", "2"]);
});

it("moving selected item above swaps it with item above", () => {
  const root = createItem("Home", [createItem("1"), createItem("2")]);

  const store = new Store(root);
  store.selectItem(root.children[1]);
  store.moveSelectedItemAbove();

  expect(root.children.map((i) => i.title)).toEqual(["2", "1"]);
});

it("moving selected item above when it is first item does nothing", () => {
  const root = createItem("Home", [createItem("1"), createItem("2")]);

  const store = new Store(root);
  store.moveSelectedItemAbove();

  expect(root.children.map((i) => i.title)).toEqual(["1", "2"]);
});
