import { createItem } from "./create";
import { Store } from "./Store";

it("traversing a tree", () => {
  const root = createItem("Home", [
    createItem("Child 1", [createItem("Child 1_1")]),
    createItem("Child 2"),
  ]);

  const store = new Store(root);
  expect(store.selectedItem.title).toEqual("Child 1");

  store.moveSelectionDown();
  expect(store.selectedItem.title).toEqual("Child 1_1");

  store.moveSelectionDown();
  expect(store.selectedItem.title).toEqual("Child 2");

  store.moveSelectionDown();
  expect(store.selectedItem.title).toEqual("Child 2");

  store.moveSelectionUp();
  expect(store.selectedItem.title).toEqual("Child 1_1");

  store.moveSelectionUp();
  expect(store.selectedItem.title).toEqual("Child 1");

  store.moveSelectionUp();
  expect(store.selectedItem.title).toEqual("Child 1");

  store.moveSelectionToFirstChild();
  expect(store.selectedItem.title).toEqual("Child 1_1");

  store.moveSelectionToParent();
  expect(store.selectedItem.title).toEqual("Child 1");

  store.moveSelectionToParent();
  expect(store.selectedItem.title).toEqual("Child 1");
});

it("store events", () => {
  const root = createItem("Home", [
    createItem("Child 1"),
    createItem("Child 2"),
  ]);

  const store = new Store(root);

  const closeCb = jest.fn();
  store.onItemClosed(closeCb);
  store.closeItem(root.children[0]);
  expect(closeCb).toHaveBeenCalledWith(root.children[0]);

  const openCb = jest.fn();
  store.onItemOpened(openCb);
  store.openItem(root.children[0]);
  expect(openCb).toHaveBeenCalledWith(root.children[0]);

  const cb = jest.fn();
  store.onSelectionChanged(cb);
  store.moveSelectionDown();
  expect(store.selectedItem.title).toEqual("Child 2");

  const previousItem = root.children[0];
  const currentSelected = root.children[1];
  expect(cb).toHaveBeenCalledWith(previousItem, currentSelected);

  store.offSelectionChanged(cb);
  store.moveSelectionUp();
});
