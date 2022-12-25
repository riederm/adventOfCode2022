
import * as fs from 'fs';

class Vec {
    key: string;
    constructor(public x: number, public y: number, public label: string = '') { this.key = `${x},${y}` }
    add(other: Vec): Vec { return new Vec(this.x + other.x, this.y + other.y) }
}

class Blizzard {
    constructor(public pos: Vec, public dir: Vec) { }
}

const [N, S, E, W] = [new Vec(0, -1, '^'), new Vec(0, 1, 'v'), new Vec(1, 0, '>'), new Vec(-1, 0, '<')];
const directions = {
    '<': W,
    '^': N,
    '>': E,
    'v': S
}

function print(blizzards: Blizzard[], w: number, h: number, pos: Vec) {
    let lines = Array.from(Array(h).keys()).map(i => {
        if (i == 0 || i == h - 1) {
            return "#".repeat(w).split("");
        } else {
            return ["#", ...".".repeat(w - 2).split(""), "#"];
        }
    });

    for (const b of blizzards) {
        lines[b.pos.y][b.pos.x] = b.dir.label;
    }
    // lines[start.y][start.x] = "S";
    // lines[finish.y][finish.x] = "E";
    lines[pos.y][pos.x] = "E";
    console.log(lines.map(l => l.join("")).join("\n"));
}

class VecMap<V> {
    map: Map<string, V> = new Map();
    _keys: Map<string, Vec> = new Map();

    add(key: Vec, value: V) {
        this._keys.set(key.key, key);
        this.map.set(key.key, value);
    }

    has(key: Vec) { return this.map.has(key.key) }

    delete(key: Vec) { this.map.delete(key.key), this._keys.delete(key.key); }

    values(): V[] { return Array.from(this.map.values()); }

    keys(): Vec[] {
        return Array.from(this._keys.values());
    }
}

let input = fs.readFileSync("input.txt").toString();

let start: Vec;
let finish: Vec;
let lines = input.split("\n");
let blizzards: Blizzard[] = [];
let borders = new VecMap();

for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
        let c = lines[y][x];
        if (y == 0 && c == ".") {
            start = new Vec(x, y);
        } else if (y == lines.length - 1 && c == ".") {
            finish = new Vec(x, y);
        } else {
            if (c == '#') {
                borders.add(new Vec(x, y), undefined);
            } else if (c != ".") {
                blizzards.push(new Blizzard(new Vec(x, y), directions[c]));
            }
        }

    }
}

const [WIDTH, HEIGHT] = [lines[0].length, lines.length];

console.log(WIDTH, HEIGHT);
console.log(start, finish, blizzards);
print(blizzards, WIDTH, HEIGHT, start);

function move(pos: Vec, dir: Vec, WIDTH: number, HEIGHT: number): Vec {
    let v = new Vec(pos.x + dir.x, pos.y + dir.y);
    if (v.x < 1) v.x = WIDTH - 2;
    if (v.x > WIDTH - 2) v.x = 1;
    if (v.y < 1) v.y = HEIGHT - 2;
    if (v.y > HEIGHT - 2) v.y = 1;
    v.key = `${v.x},${v.y}`
    return v;
}

function blizzardMap(b: Blizzard[]): VecMap<Blizzard> {
    let vm = new VecMap<Blizzard>();
    for (const bz of b) {
        vm.add(bz.pos, bz);
    }
    return vm;
}



function solve(start: Vec, finish: Vec): number {
    let currentPositions: Vec[] = [start];
    let minute = 0;
    while (!currentPositions.some(it => it.x == finish.x && it.y == finish.y)) {
        let prevBlizzards = JSON.parse(JSON.stringify(blizzards));
        for (const b of blizzards) {
            b.pos = move(b.pos, b.dir, WIDTH, HEIGHT);
        }
        let blizzardFields = blizzardMap(blizzards);
        let nextPositions = new VecMap<boolean>;
        for (const cp of currentPositions) {
            //find possible moves
            let moves = [new Vec(0, 0, "stay"), ...Object.values(directions)]
                // .map(d => cp.add(d))
                //skip illegal
                .filter(d => {
                    let p = cp.add(d);
                    return (p.x >= 0 && p.y >= 0 && p.x < WIDTH && p.y < HEIGHT)
                        && !borders.has(p)
                        && !blizzardFields.has(p)
                        && !nextPositions.has(p)
                });
            moves
                .forEach(it => {
                    nextPositions.add(cp.add(it), true)
                    //  console.log("minute", minute+1, ", move", it.label);
                    //  print(prevBlizzards, WIDTH, HEIGHT, cp);
                    //  print(blizzards, WIDTH, HEIGHT, cp.add(it));
                    //  console.log();
                });
        }
        // console.log("################################")
        currentPositions = nextPositions.keys();
        minute++;
    }
    return minute;
}

let [r1, r2, r3] = [solve(start, finish),solve(finish, start),solve(start, finish)];

console.log(r1);
console.log(r1+r2+r3)