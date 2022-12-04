class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    fullyContains(other) {
        return other.start >= this.start && other.end <= this.end;
    }

    overlaps(other) {
        return !((other.end < this.start) || (other.start > this.end))
    }
}

var lines = require('fs')
    .readFileSync('input.txt').toString().split("\n")
    .map(line => line.split(",").map(it => it.split("-"))
    .map(p => new Range(+p[0], +p[1])));

//a
console.log(lines.filter(pair => pair[0].fullyContains(pair[1]) || pair[1].fullyContains(pair[0])).length);

//b
console.log(lines.filter(pair => pair[0].overlaps(pair[1])).length);