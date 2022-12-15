import * as fs from 'fs';
import { flatten, max, min, sortedLastIndexBy, startsWith } from 'lodash';

class Vec {
    public key: string;
    constructor(public x: number, public y: number) {
        // this.key = `${this.x},${this.y}`;
    }

    add(other: Vec): Vec {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    sub(other: Vec): Vec {
        return new Vec(this.x - other.x, this.y - other.y);
    }

    dist(other: Vec): number {
        return Math.abs(this.x - other.x) + Math.abs(this.y + other.y);
    }


}

class Sensor {
    constructor(public position: Vec, public beacon: Vec) { }

    distToBeacon(): number {
        return this.position.dist(this.beacon);
    }

    allCoveredFields(): Vec[] {
        let fields: Vec[] = [];
        let dist = this.distToBeacon();
        // current line
        for (let y = -dist; y <= dist; y++) {
            for (let x = -dist; x <= dist; x++) {
                let v = new Vec(x, y);
                if (v.dist(this.position) <= dist) {
                    fields.push(v);
                }
            }
        }
        return fields;
    }
}

let lines = fs
    .readFileSync('input.test.txt').toString()
    .split("\n");


let sensors: Sensor[] = [];
let [minX, maxX, minY, maxY] = [9999999999, -9999999999, 9999999999, -999999999999];
for (const l of lines) {
    let groups = /Sensor at x=(.+), y=(.+): closest beacon is at x=(.+), y=(.*)/gm.exec(l);
    let s = new Sensor(new Vec(+groups[1], +groups[2]), new Vec(+groups[3], +groups[4]))
    sensors.push(s);
    minX = Math.min(minX, s.position.x);
    minX = Math.min(minX, s.beacon.x);
    maxX = Math.max(maxX, s.position.x);
    maxX = Math.max(maxX, s.beacon.x);

    minY = Math.min(minY, s.position.y);
    minY = Math.min(minY, s.beacon.y);
    maxY = Math.max(maxY, s.position.y);
    maxY = Math.max(maxY, s.beacon.y);
}
console.log(sensors);
console.log(minX, maxX, minY, maxY);

let line = 2000000;
//find sensors in range
class Range {
    constructor(public start: number, public end: number) {

    }

    overlaps(other: Range): boolean {
        return !(this.end < other.start || this.start > other.end);
    }

    span(other: Range) {
        return new Range(Math.min(this.start, other.start), Math.max(this.end, other.end));
    }

}

function combine(r1: Range, r2: Range) {

}

let candidates = new Set<string>();
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

console.log(ranges);


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
console.log(ranges);
for (let s of sensors){
    if (s.beacon.y == line){
        console.log(s);
    }
}