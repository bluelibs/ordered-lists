import { OrderedList } from "./OrderedList";
import { OrderedNumbers } from "./OrderedNumbers";

export function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

export class OrderedListCollection<T = any> {
  protected isLocked: boolean = false;
  protected orderedLists: OrderedList<T>[] = [];
  protected elementsAfterLocked: T[] = [];
  /**
   * This is initialised after compilation
   */
  protected orderedKeys: OrderedNumbers;

  store = new Map<number, T[]>();

  constructor(orderedLists: OrderedList<T>[]) {
    this.orderedLists = orderedLists;

    // attach events
    this.orderedLists.forEach((orderedList) => {
      orderedList.onAdd((element, order) => {
        if (this.isLocked) {
          return;
        }

        if (this.store.has(order)) {
          this.store.get(order).push(element);
        } else {
          this.orderedKeys.add(order);
          this.store.set(order, [element]);
        }
      });
    });
    this.compile();
  }

  protected compile() {
    for (const orderedList of this.orderedLists) {
      for (const key of orderedList.orderedKeys.value()) {
        if (this.store.has(key)) {
          this.store.get(key).push(...orderedList.store.get(key));
        } else {
          this.store.set(key, orderedList.store.get(key).slice(0));
        }
      }
    }

    const numbers = this.orderedLists
      .map((ol) => ol.orderedKeys.value())
      .flat(1)
      .filter(onlyUnique)
      .sort();

    this.orderedKeys = new OrderedNumbers(numbers);
  }

  elements(): T[] {
    if (this.isLocked) {
      return this.elementsAfterLocked;
    }

    return this.orderedKeys
      .value()
      .map((key) => this.store.get(key))
      .flat(1);
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
}
