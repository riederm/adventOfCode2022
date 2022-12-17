import * as fs from 'fs';

class Vec {
    public key: string;
    constructor(public x: number, public y: number) {
        this.key = `${x},${y}`;
    }

    add(other: Vec): Vec {
        return new Vec(this.x + other.x, this.y + other.y);
    }
}
function vec(x: number, y: number) { return new Vec(x, y) }

let jets = fs
    .readFileSync('input.txt').toString()
    .split("\n")[0].split("");


let shapeHeights = [
    1, 3, 3, 4, 2
]

let shapes = [
    [vec(0, 0), vec(1, 0), vec(2, 0), vec(3, 0)],
    [vec(1, 0), vec(1, 1), vec(1, 2), vec(0, 1), vec(2, 1)],
    [vec(2, 0), vec(2, 1), vec(2, 2), vec(1, 2), vec(0, 2)],
    [vec(0, 0), vec(0, 1), vec(0, 2), vec(0, 3)],
    [vec(0, 0), vec(1, 0), vec(0, 1), vec(1, 1)],
];

let field = new Set<string>();
//block level 0
for (let i = 0; i < 7; i++) {
    field.add(vec(i, 0).key);

}

function hasConflict(shape: Vec[], pos: Vec): boolean {
    //see if this is blocked
    return shape.some(p => {
        let v = pos.add(p);
        return field.has(v.key)
            || v.x < 0 || v.x > 6;
    });
}

function getSnapshot(startLine: number, n: number, jet: number, shape: number) {
    let snapshot = '';
    for (let y = 0; y < n; y++) {
        for (let x = 0; x < 7; x++) {
            let v = vec(x, y + startLine);
            if (field.has(v.key)) {
                snapshot += '#';
            } else {
                snapshot += '.';
            }
        }
        snapshot += '\n';
    }
    return snapshot + "\n" + `${jet},${shape}`;
}

function getJetVec(i: number): Vec {
    let j = jets[i % jets.length];
    if (j == "<") {
        return vec(-1, 0);
    } else {
        return vec(1, 0);
    }
}

function draw(shape: Vec[], pos: Vec) {
    let s = new Set();
    shape.forEach(it => s.add(it.add(pos).key));

    let line = "";
    for (let y = -25; y <= 0; y++) {
        for (let x = 0; x < 7; x++) {
            let v = vec(x, y);
            line += s.has(v.key) ? '@' :
                field.has(v.key) ? '#' : ".";
        }
        console.log('|' + line + '|');
        line = "";
    }
    console.log();

}

let [maxHeight, jet] = [0, 0];
let [rocksPerCycle, heightGainPerCycle]: [number, number] = [undefined, 0];
let snapshots = new Map<string, [/*rocks*/number, /*height*/number]>();  //remember seen situations
let heights = [];   //remember the height for rock#

// for (let i = 0; i < 2022; i++) {
let i = 0;
while (rocksPerCycle == undefined) {

    let pos = vec(2, maxHeight - shapeHeights[i % shapes.length] - 3)
    let shape = shapes[i % shapes.length];
    let blocked = false;
    do {
        //jet movement
        let nextPos = pos.add(getJetVec(jet++));
        if (!hasConflict(shape, nextPos)) {
            pos = nextPos;
        }
        //gravity movement
        nextPos = pos.add(vec(0, 1));
        blocked = hasConflict(shape, nextPos);
        if (!blocked) {
            pos = nextPos;
        }
    } while (!blocked);
    //place piece
    shape.forEach(p => field.add(p.add(pos).key));
    // draw(shape, pos);
    maxHeight = Math.min(maxHeight, pos.y);
    heights[i] = maxHeight;

    //create a snapshot of the last 5 lines and see if we've seen this situation already
    let shot = getSnapshot(maxHeight, 5, jet % jets.length, i % shapes.length);
    if (snapshots.has(shot)) {
        //cylce detected. remember where we found that cycle
        let [rocks, height] = snapshots.get(shot);
        rocksPerCycle = i - rocks;
        heightGainPerCycle = maxHeight - height;
    }
    snapshots.set(shot, [i, maxHeight]);
    i++;
}

{
    let target = 2022;
    console.log("a)", -3144);
    console.log("a)", (heightGainPerCycle * Math.floor(target / rocksPerCycle)) + heights[target % rocksPerCycle - 1]);
}
{
    let target = 1000000000000;
    console.log("b)", -1565242165201);
    console.log("b)", (heightGainPerCycle * Math.floor(target / rocksPerCycle)) + heights[target % rocksPerCycle - 1]);
}