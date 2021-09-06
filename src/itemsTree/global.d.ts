type Item = {
  title: string;
  children: Item[];
  isOpen?: boolean;
  //these are additional fields to simplify tree traversal
  globalIndex: number;
  parent?: Item;
};
