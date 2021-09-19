import { createItem } from "./create";
import { Store } from "./Store";

it("figuring out Store API via tests", () => {
  const root = createItem("Home", [
    createItem("Child 1", [createItem("Child 1_1")]),
    createItem("Child 2"),
  ]);

  const store = new Store(root);
  expect(store.selectedItem.title).toEqual("Child 1");

  const cb = jest.fn();
  store.onSelectionChanged(cb);
  store.moveSelectionDown();
  expect(store.selectedItem.title).toEqual("Child 1_1");

  const previousItem = root.children[0];
  const currentSelected = root.children[0].children[0];
  expect(cb).toHaveBeenCalledWith(previousItem, currentSelected);

  store.offSelectionChanged(cb);
  store.moveSelectionUp();
  expect(store.selectedItem.title).toEqual("Child 1");
  expect(cb).toHaveBeenCalledTimes(1);
});

// it("open/close events", () => {
//   const root = createItem("Home", [createItem("Child 1")]);

//   const store = new Store(root);

//   const cb = jest.fn();
//   store.onItemClosed(cb);
//   store.closeItem(root.children[0]);
//   expect(cb).toHaveBeenCalledWith(root.children[0]);
// });
