const { assert } = require('console');

var lines = require('fs')
    .readFileSync('input.txt').toString().split("\n");

function ascii(c) {
    return c.charCodeAt(0);
}
function prio(c) {
    const code = ascii(c);
    if (code >= ascii("A") && code <= ascii("Z")) {
        return code - ascii("A") + 27;
    } else if (code >= ascii("a") && code <= ascii("z")) {
        return code - ascii("a") + 1;
    }
}

function calc(l) {
    const half = Math.ceil(l.length / 2);
    const left = l.substring(0, half);
    const right = l.substring(half);

    for (const c of left.split('')) {
        if (right.indexOf(c) >= 0) {
            return prio(c);
        }
    }
    assert(false)
}

// task 1
console.log(lines.map(l => calc(l)).reduce((a,b) => a+b));

// task 2
var sum = 0;
while (lines.length > 0) {
    var rucksacks = lines.splice(0, 3);
    const hit = rucksacks[0].split('')
        .find(c => rucksacks[1].indexOf(c) >= 0 && rucksacks[2].indexOf(c) >= 0);
    sum += prio(hit);
}
console.log(sum);