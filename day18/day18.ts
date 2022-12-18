import * as fs from 'fs';

class Vec {
    public key: string;
    constructor(public x: number, public y: number, public z: number) {
        this.key = `${x},${y},${z}`;
    }

    add(other: Vec): Vec {
        return new Vec(this.x + other.x, this.y + other.y, this.z + other.z);
    }
}
function vec(x: number, y: number, z: number) { return new Vec(x, y, z) }

let gridPoints = fs
    .readFileSync('input.txt').toString()
    .split("\n")
    .map(line => {
        let segments = line.split(",").map(it => +it);
        return vec(segments[0], segments[1], segments[2])
    });


let grid = new Set<string>();
gridPoints.forEach(it => grid.add(it.key));


const directions = [
    vec(1, 0, 0),
    vec(-1, 0, 0),
    vec(0, 1, 0),
    vec(0, -1, 0),
    vec(0, 0, 1),
    vec(0, 0, -1),
]

{
    let sum = 0;
    for (const v of gridPoints) {
        sum += directions.map(d => v.add(d))
                .map(n => (grid.has(n.key)) ? 0 : 1)
                .reduce((a, b) => a + b, 0);

    }
    console.log("a): ", sum);
}


let minComp = Math.min(...gridPoints.map(it => Math.min(it.x, it.y, it.z))) - 1;
let maxComp = Math.max(...gridPoints.map(it => Math.max(it.x, it.y, it.z))) + 1;
// b
let min = vec(minComp, minComp, minComp);
let max = vec(maxComp, maxComp, maxComp);

function flood(cell: Vec): Vec[] {
    if (cell.key == '2,2,5') {
        console.log();

    }
    let knownAir = new Set<string>();
    knownAir.add(cell.key);
    let knownAirArr: Vec[] = [cell];

    //grow each cell by 1
    let nextCells = [cell];
    while (nextCells.length > 0) {
        let c = nextCells.pop();
        let neighbours = directions.map(d => c.add(d))
            .filter(it => !grid.has(it.key) && !knownAir.has(it.key))


        //if anything escaped the square we're out
        if (neighbours.some(n => n.x < min.x || n.y < min.y || n.z < min.z
            || n.x > max.x || n.y > max.y || n.z > max.z)) {
            return [];
        }
        for (const n of neighbours) {
            nextCells.push(n);
            knownAir.add(n.key);
            knownAirArr.push(n);
        }

    }
    return knownAirArr;
}

//collect everything that touches the grid
let border: Vec[] = [];
let covered: Set<string> = new Set();
for (const point of gridPoints) {
    let borderCandidates = directions.map(d => point.add(d))
        .filter(it => !grid.has(it.key))
        .filter(it => !covered.has(it.key));

    for (const b of borderCandidates) {
        covered.add(b.key);
        border.push(b);
    }
}
// now flood from every point that touches the grid
let knownPockets = new Set<string>();
let ip = 0;
for (const b of border) {
    if (!knownPockets.has(b.key)){
        let pocket = flood(b);
        if (pocket.length > 0) {
            console.log("found pocket for ", b, " size", pocket.length);
            ip++;
            for (const np of pocket) {
                knownPockets.add(np.key);
                grid.add(np.key)
            }
        }
    }
}

{
    //count how many sides dont touch grid
    let sum = 0;
    for (const v of gridPoints) {
        sum += directions.map(d => v.add(d))
                .map(n => (grid.has(n.key)) ? 0 : 1)
                .reduce((a, b) => a + b, 0);

    }
    console.log("b): ", sum);
}