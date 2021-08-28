import { OrderedList } from "../OrderedList";
import { OrderedListCollection } from "../OrderedListCollection";
import { OrderedNumbers } from "../OrderedNumbers";

test("OrderedList", () => {
  const list = new OrderedList<string>();

  list.add(" world");
  list.add("Hello", -1);
  list.add("!", 1);

  expect(list.elements().join("")).toBe("Hello world!");

  list.add("!", 1);
  expect(list.elements().join("")).toBe("Hello world!!");

  list.add("!", -1);
  expect(list.elements().join("")).toBe("Hello! world!!");

  const onAdd = jest.fn((element, order) => {
    expect(element).toBe("here");
    expect(order).toBe(10);
  });

  list.onAdd(onAdd);
  list.add("here", 10);
  expect(onAdd).toBeCalledTimes(1);
});

test("OrderedListCollection", () => {
  const list1 = new OrderedList<string>();
  const list2 = new OrderedList<string>();
  list1.add("Hello", 1);
  list2.add("world", 1);
  list1.add("!", 2);
  list2.add("You are very precious!", 3);

  const listCollection = new OrderedListCollection([list1, list2]);
  expect(listCollection.elements().join("")).toBe(
    "Helloworld!You are very precious!"
  );

  list1.add("!", 0);
  expect(listCollection.elements().join("")).toBe(
    "!Helloworld!You are very precious!"
  );
});

test("OrderedNumbers", () => {
  const on = new OrderedNumbers();

  on.add(1);
  on.add(4);
  on.add(7);
  on.add(2);
  on.add(-5);

  expect(on.value().join(" ")).toBe("-5 1 2 4 7");
});
