# Append-Only Performance-focused Ordered Lists

The application of these ordered lists (which work with any data type) which are suited when you have event-chains or functional chains that support injecting additional handlers to it in a specific order.

For example, you have an event, and to that event you attach certain handlers with a certain priority. Each event will hold its very own `OrderedList` of handlers so it knows exactly how to call them.

Play around: https://codesandbox.io/s/ordered-lists-demo-f9pe3?file=/src/index.ts

## Install

```bash
npm i -S @bluelibs/ordered-lists
```

## Benchmarks

```ts
npm run benchmark
```

The result for 1M records and `1000` orders tested on `M1` CPU:

```
Time elapsed for setting up the list: 28ms
Time elapsed getting sorted elements: 72ms for ordering.
```

## Documentation

The `OrderedListCollection` is as performant having very little overhead over each individual collection sort.

The `OrderedList` is append-only and has two main ways of interraction `add()` and `elements()`:

```ts
import { OrderedList, OrderedListCollection } from "@bluelibs/ordered-lists";

const orderedList = new OrderedList<string>();

orderedList.add("Hello", 1);
orderedList.add("world!", 2);

orderedList.elements().join(" "); // Hello world!
```

Typically `orderedList` are a sort-of "compile-time" built-up, as you construct your application logic. This means that after the initial configurations, you will no longer "add" to them. The solution is to `lock()` them so `elements()` get stored into memory in an ordered fashion and accessing it is instant.

```ts
orderedList.lock();
orderedList.elements(); // instantly
```

You can hook and watch when elements get added:

```ts
orderedList.onAdd((element, order) => {
  // Do something
});
```

The `OrderedListCollection` is responsible of getting your data from multiple ordered lists:

```ts
const orderedList1 = new OrderedList<string>();
const orderedList2 = new OrderedList<string>();

const collection = new OrderedListCollection([orderedList1, orderedList2]);

collection.elements(); // Get all the elements ordered from both lists with their orders properly merged

collection.lock(); // This would store all elements() into memory and will no longer react to changes.
```
