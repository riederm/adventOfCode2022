/**
 * 
 * 
 *  [V] [G]             [H]        
[Z] [H] [Z]         [T] [S]        
[P] [D] [F]         [B] [V] [Q]    
[B] [M] [V] [N]     [F] [D] [N]    
[Q] [Q] [D] [F]     [Z] [Z] [P] [M]
[M] [Z] [R] [D] [Q] [V] [T] [F] [R]
[D] [L] [H] [G] [F] [Q] [M] [G] [W]
[N] [C] [Q] [H] [N] [D] [Q] [M] [B]
 1   2   3   4   5   6   7   8   9 
 * 
 */
let stacks = [
    'NDMQBPZ',
    'CLZQMDHV',
    'QHRDVFZG',
    'HGDFN',
    'NFQ',
    'DQVZFBT',
    'QMTZDVSH',
    'MGFPNQ',
    'BWRM',
].map(it => it.split(''));

let lines = require('fs')
    .readFileSync('input.txt').toString()
    .replaceAll("move ", "")
    .replaceAll(" from ", ",")
    .replaceAll(" to ", ",")
    .split("\n");

let instructions = lines
    .map(l => l.split(","))
    .map(segs => { return { count: +segs[0], from: +segs[1], to: +segs[2] } });

//a
// deep copy stacks
let stacks_a = JSON.parse(JSON.stringify(stacks));
for (const i of instructions) {
    for (let j = 0; j < i.count; j++) {
        stacks_a[i.to - 1].push(stacks_a[i.from - 1].pop());
    }
}
console.log(stacks_a.map(it => it.pop()).reduce((a, b) => a + b, ''));

//b
for (const i of instructions) {
    let from = stacks[i.from - 1];
    let to = stacks[i.to - 1];
    to.push(...from.splice(from.length - i.count, i.count));
}
console.log(stacks.map(it => it.pop()).reduce((a, b) => a + b, ''));