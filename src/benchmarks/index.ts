import { PerformanceObserver, performance } from "perf_hooks";
import { OrderedList } from "../OrderedList";
import { OrderedListCollection } from "../OrderedListCollection";

const setup = new Date();

const list1 = new OrderedList<number>();
for (let i = 100; i > 0; i--) {
  for (let j = 1000; j > 0; j--) {
    list1.add(j * i, i);
  }
}

// const list2 = new OrderedList<number>();
// for (let i = 10000; i > 0; i--) {
//   for (let j = 100; j > 0; j--) {
//     list2.add(j * i, i);
//   }
// }

const now = new Date();
// const collection = new OrderedListCollection([list1, list2]);
// const elements = collection.elements();
// const elements = OrderedList.from([list1, list2]);
// list2.elements();
list1.elements();

const done = new Date();

console.log(
  `Time elapsed for setting up the list: ${now.getTime() - setup.getTime()}ms`
);
console.log(
  `Time elapsed getting sorted elements: ${
    done.getTime() - now.getTime()
  }ms for ordering.`
);

// console.log(`Elements ${elements.length}`);
// RAPID Union of orderedKeys to lower the threshold of 25ms > 17ms
