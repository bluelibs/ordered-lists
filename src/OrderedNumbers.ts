export class OrderedNumbers {
  protected numbers: number[] = [];

  /**
   * This only applies to an already sorted and unique list of numbers. Ensure that is the case.
   * @param numbers
   */
  constructor(numbers?: number[]) {
    if (numbers) {
      this.numbers = numbers;
    }
  }

  add(number: number) {
    const index = this.numbers.findIndex((n) => n >= number);
    if (this.numbers[index] === number) {
      return;
    }
    if (index === -1) {
      this.numbers.push(number);
    } else {
      this.numbers.splice(index, 0, number);
    }
  }

  value() {
    return this.numbers;
  }
}
