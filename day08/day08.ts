
import * as fs from 'fs';

let buf = fs
    .readFileSync('input.txt').toString()
    .split("\n").map(it => it.split("").map(it => +it));

function isValid(x: number, y: number) {
    return x >= 0 && y >= 0 && y < buf.length && x < buf[0].length;
}

function isEdgeVisible(px: number, py: number, dx: number, dy: number) {
    let init = buf[py][px];
    do {
        py += dy;
        px += dx;
    } while (isValid(px, py) && buf[py][px] < init)

    return !isValid(px, py);
}
function getDistance(x: number, y: number, dx: number, dy: number): number {
    let init = buf[y][x];
    let dist = 0; //count ourselfs
    do {
        x += dx;
        y += dy;
        dist += 1;
    } while (
        buf[y][x] < init
        && x > 0 && y > 0
        && y < buf.length - 1 && x < buf[0].length - 1);
    return dist;
}



//[x,y]
const directions: [number, number][] = [
    [-1, +0], //left
    [+1, +0], //right
    [+0, -1], //up
    [+0, +1], //down
];
let visible = 0;
for (let x = 0; x < buf.length; x++) {
    for (let y = 0; y < buf[x].length; y++) {
        if (directions.some(([dx, dy]) => isEdgeVisible(x, y, dx, dy))) {
            visible++;
        }
    }
}
console.log("a", visible)

let max = 0;
// dont check most outer row/col
for (let y = 1; y < buf.length - 1; y++) {
    for (let x = 1; x < buf[y].length - 1; x++) {
        let current = directions.map(([dx, dy]) => getDistance(x, y, dx, dy))
            .reduce((a, b) => a * b, 1);
        max = Math.max(current, max);
    }
}
console.log("b", max);

