type Func = (...args: any) => any;

export class Events<TDefinitions extends Record<string, Func>> {
  private cbs: Partial<Record<keyof TDefinitions, Func[]>> = {};

  on<T extends keyof TDefinitions>(event: T, cb: TDefinitions[T]) {
    this.cbs[event] = this.cbs[event] || [];
    this.cbs[event]!.push(cb);
  }

  off<T extends keyof TDefinitions>(event: T, cb: TDefinitions[T]) {
    this.cbs[event] =
      this.cbs[event] && this.cbs[event]!.filter((c) => c != cb);
  }

  trigger<T extends keyof TDefinitions>(
    event: T,
    ...args: Parameters<TDefinitions[T]>
  ) {
    const cbs = this.cbs[event];
    //@ts-expect-error don't know how to fix ...args error
    cbs && cbs.forEach((cb) => cb(...args));
  }
}
