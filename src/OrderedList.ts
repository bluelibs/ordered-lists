import { OrderedNumbers } from "./OrderedNumbers";
export type OnAddCallback<T> = (value: T, orderKey: number) => void;

export class OrderedList<T> {
  store = new Map<number, T[]>();
  orderedKeys = new OrderedNumbers();
  isLocked: boolean = false;
  elementsAfterLocked: T[];
  onAddCallbacks: OnAddCallback<T>[] = [];

  elements(): T[] {
    if (this.isLocked) {
      return this.elementsAfterLocked;
    }

    return this.orderedKeys
      .value()
      .map((key) => this.store.get(key))
      .flat(1);
  }

  add(element: T, orderKey: number = 0) {
    if (this.isLocked) {
      throw new Error("List is locked");
    }

    if (this.store.has(orderKey)) {
      this.store.get(orderKey).push(element);
    } else {
      this.orderedKeys.add(orderKey);
      this.store.set(orderKey, [element]);
    }

    this.onAddCallbacks.forEach((callback) => callback(element, orderKey));
  }

  /**
   * Lock the ordered list.
   */
  lock() {
    const elements = this.elements();
    this.isLocked = true;
    this.elementsAfterLocked = elements;

    // cleanup
    delete this.store;
    delete this.orderedKeys;
  }

  /**
   * Slow solution for getting elements for multiple ordered lists
   * @param orderedLists
   * @returns
   */
  static from(orderedLists: OrderedList<any>[]): any[] {
    const map = new Map<number, any[]>();
    for (const orderedList of orderedLists) {
      for (const key of orderedList.orderedKeys.value()) {
        const values = map.get(key) || [];
        map.set(key, [...values, ...orderedList.store.get(key)]);
      }
    }

    const keys = Array.from(map.keys()).sort();

    return keys.map((key) => map.get(key)).flat(1);
  }

  onAdd(callback: OnAddCallback<T>) {
    this.onAddCallbacks.push(callback);
  }
}
