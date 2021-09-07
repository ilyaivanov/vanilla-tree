declare var gsap: any;

type Vector = {
  x: number;
  y: number;
};

declare function haveBeenCalledWith<T extends (...args: any) => any>(
  fn: T,
  ...args: Parameters<T>
);

declare function haveLastBeenCalledWith<T extends (...args: any) => any>(
  fn: T,
  ...args: Parameters<T>
);

declare function haveBeenCalled<T extends (...args: any) => any>(fn: T);

declare function areEqual<T>(a: T, b: T);
declare function areSame<T>(a: T, b: T);
