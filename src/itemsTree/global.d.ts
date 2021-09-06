type Item = {
  title: string;
  children: Item[];

  //these are additional fields to simplify tree traversal
  globalIndex: number;
  parent?: Item;
};
