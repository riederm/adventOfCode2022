import * as fs from 'fs';

class Vec {
    public key: string;
    constructor(public x: number, public y: number) {
    }

    add(other: Vec): Vec {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    sub(other: Vec): Vec {
        return new Vec(this.x - other.x, this.y - other.y);
    }

    manhatten(other: Vec): number {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    }
}

class Sensor {
    constructor(public position: Vec, public beacon: Vec) { }

    distToBeacon(): number {
        return this.position.manhatten(this.beacon);
    }
}

let lines = fs
    .readFileSync('input.txt').toString()
    .split("\n");


let sensors: Sensor[] = [];
for (const l of lines) {
    let groups = /Sensor at x=(.+), y=(.+): closest beacon is at x=(.+), y=(.*)/gm.exec(l);
    let s = new Sensor(new Vec(+groups[1], +groups[2]), new Vec(+groups[3], +groups[4]))
    sensors.push(s);
}
console.log(sensors.map(it => [it.position, it.beacon, it.distToBeacon()]));

//find sensors in range
class Range {
    constructor(public start: number, public end: number) {
    }

    overlaps(other: Range): boolean {
        return !(this.end < (other.start-1) || this.start > (other.end+1));
    }

    span(other: Range) {
        return new Range(Math.min(this.start, other.start), Math.max(this.end, other.end));
    }

    length(): number {
        return this.end - this.start;
    }
}

function findRanges(line: number) : Range[] {
    let ranges: Range[] = [];
    for (const s of sensors) {

        // see if s is a candidate
        let d = s.distToBeacon();
        if (s.position.y - d <= line && s.position.y + d >= line) {
            //candidate, lets whatt it spans in [line]
            let deltaY = Math.abs(s.position.y - line);
            // for every deltaY we lose one x to left and one x to right
            ranges.push(new Range(s.position.x - d + deltaY, s.position.x + d - deltaY));
        }
    }
    // console.log(ranges);

    function tryCombine(ranges: Range[]): boolean {
        for (const a of ranges) {
            let combined = false;
            for (const b of ranges) {
                if (a !== b && a.overlaps(b)) {
                    // remove both and push combination
                    ranges.splice(ranges.indexOf(a), 1);
                    ranges.splice(ranges.indexOf(b), 1);
                    ranges.push(a.span(b));
                    return true;
                }
            }
        }
    }

    //combine overlapping ranges
    while (tryCombine(ranges)) {
    }
    // console.log(ranges);
    return ranges;
}

console.log("a)", findRanges(2000000).map(it => it.length()).reduce((a, b) => a + b, 0));

for (let y = 0; y < 4000000; y++) {
    let ranges = findRanges(y);
    // if (y % 100000 == 0) console.log(y);
    
    if (ranges.length == 2) {
        console.log("b)", y, (ranges[0].end+1)*4000000+y);
    }
}
