import * as fs from 'fs';

function parseMonkey(mtext: string) {
    let lines = mtext.split("\n");
    let id = +/Monkey (.*):/gm.exec(lines[0])![1];
    let items = /Starting items: (.*)/gm.exec(lines[1])![1].split(",").map(it => +it);
    let operation = /Operation: new = (.*)/gm.exec(lines[2])![1];
    let divisor = +/Test: divisible by (.*)/gm.exec(lines[3])![1];
    let posTarget = +/If true: throw to monkey (.*)/gm.exec(lines[4])![1];
    let negTarget = +/If false: throw to monkey (.*)/gm.exec(lines[5])![1];

    return new Monkey(
        id, 
        items, 
        (input: number) => +eval(operation.replaceAll("old", '' + input)), 
        divisor, 
        posTarget, 
        negTarget);
}

let monkeys  : Monkey[] = [];
let primeProduct = 0;

class Monkey {
    constructor(
        public id: number,
        public items: number[],
        public operationSrc: (input: number) => number,
        public divisor: number,
        public positiveTestTarget: number,
        public negativeTestTarget: number) {
    }

    public inspect() {
        if (this.items.length > 0) {
            let item = this.items[0]
            item = this.operationSrc(item);
            this.items[0] = item;
            this.items[0] = this.items[0] % primeProduct;
            if (item % this.divisor == 0) {
                // this.items[0] = 0;
                return this.positiveTestTarget;
            } else {
                // this.items[0] = item % this.divisor;
                return this.negativeTestTarget;
            }
        }
        return undefined;
    }
}

monkeys = fs
    .readFileSync('input.txt').toString()
    .split("\n\n")
    .map(block => parseMonkey(block));

primeProduct = monkeys.reduceRight((a,b) => a*b.divisor, 1);

let count: number[] = monkeys.map(it => 0);
for (let c = 0; c < 10000; c++) {
    for (const m of monkeys) {
        while (m.items.length > 0) {
            let target = m.inspect() as number;
            monkeys[target].items.push(m.items.shift() as number);
            count[m.id]++;
        }
    }
}

console.log(count);

let sorted = count.sort((a,b) => b-a);
console.log(sorted[0] * sorted[1]);