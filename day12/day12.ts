import { DESTRUCTION, setDefaultResultOrder } from 'dns';
import * as fs from 'fs';
import { endianness } from 'os';
class Vec {
    public key: string;
    constructor(public x: number, public y: number) {
        this.key = `${this.x},${this.y}`;
    }

    add(other: Vec): Vec {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    manhatten(other: Vec): number {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    }
}


let start = new Vec(-1, -1);
let dest = new Vec(-1, -1);

let lines = fs
    .readFileSync('input.txt').toString()
    .split("\n").map(it => it.split(""));

let terrain = lines.map(it => it.map(it => it.charCodeAt(0) - "a".charCodeAt(0)));

for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
        const element = line[x];
        if (element == "S") {
            start = new Vec(x, y);
            terrain[y][x] = 0;
        } else if (element == "E") {
            dest = new Vec(x, y);
            terrain[y][x] = "z".charCodeAt(0) - "a".charCodeAt(0);
        }
    }
}
console.log(start, dest);


const dir = [
    new Vec(-1, 0),
    new Vec(1, 0),
    new Vec(0, -1),
    new Vec(0, 1)
]

function isInside(pos: Vec) {
    return pos.x >= 0 && pos.y >= 0 && pos.y < terrain.length && pos.x < terrain[0].length;
}

function getNeighbours(pos: Vec) {
    return dir.map(it => pos.add(it)).filter(it => isInside(it))
}


let shortest: Vec[] = [];
let hints: Map<string, number> = new Map();
let visited = new Set<string>()
function walk(path: Vec[]) {
    let pos = path[path.length - 1];
    if (pos.x == dest.x && pos.y == dest.y) {
        //reached
        if (shortest.length == 0 || path.length < shortest.length) {
            shortest = [...path];
        }
        return;
    }

    let steps = getNeighbours(pos)
        .filter(next => !visited.has(next.key))
        .filter(next =>
            terrain[next.y][next.x] - terrain[pos.y][pos.x] <= 1);

    steps = steps.sort((a, b) => a.manhatten(dest) - b.manhatten(dest));

    for (const s of steps) {

        path.push(s);
        if ((hints.get(s.key) || 99999999999999) > path.length) {
            hints.set(s.key, path.length)
            visited.add(s.key);
            walk(path);
            visited.delete(s.key);
        }
        path.pop();
    }
}


walk([start]);
console.log("done")
console.log(shortest);
console.log(shortest.length-1);


let starters = [start];
for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
        if (terrain[y][x] == 0){
            starters.push(new Vec(x,y));
        }
    }
}

let i  =0 ;
let candidates = starters.map(start => {
    visited = new Set();
    // hints = new Map();
    shortest = [];
    walk([start]);
    console.log(i++, shortest.length)
    return shortest.length-1
}).filter(it => it !==-1).sort((a,b) => b-a)
console.log(candidates);