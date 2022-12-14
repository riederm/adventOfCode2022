
import * as fs from 'fs';
import { flatten, max, min, sortedLastIndexBy, startsWith } from 'lodash';

class Vec {
    public key: string;
    constructor(public x: number, public y: number) {
        this.key = `${this.x},${this.y}`;
    }

    add(other: Vec): Vec {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    sub(other: Vec): Vec {
        return new Vec(this.x - other.x, this.y - other.y);
    }

    shorten(): Vec {
        let _x = this.x / (Math.abs(this.x) || 1);
        let _y = this.y / (Math.abs(this.y) || 1);
        return new Vec(_x, _y);
    }

}

class Map {
    field: string[][] = [];
    constructor(private minX: number, private maxX: number, private minY: number, private maxY: number, private blockY : number) {
        for (let i = 0; i <= maxY - minY; i++) {
            this.field.push(".".repeat(maxX - minX).split(""))
        }
    }

    putRock(x: number, y: number) {
        if (x == 502 && y == 9) {
            console.log("aa");

        }
        this.field[y - this.minY][x - this.minX] = "#";
    }

    putSand(x: number, y: number) {
        this.field[y - this.minY][x - this.minX] = "O";
    }

    isFree(x: number, y: number): boolean {
        if (y == this.blockY) return false;
        return this.isOutside(x,y) || this.field[y - this.minY][x - this.minX] == ".";
    }
    
    isOutside(x:number, y:number):boolean{
        return false;
        // return (x < this.minX ||  x > this.maxX || y > this.maxY || y < this.minY);

    }

    delete(x:number, y:number){

        this.field[y - this.minY][x - this.minX] = ".";
    }

    print() {
        for (const l of this.field) {
            console.log(l.join(""))
        }
    }
}


let lines = fs
    .readFileSync('input.txt').toString()
    .split("\n");

let rocks = lines.map(l =>
    l.split(" -> ").map(it => it.split(",").map(it => +it)));

let rocksX = rocks.map(r => r.map(it => it[0]));
let [maxX, minX] = [max(flatten(rocksX)), min(flatten(rocksX))];
console.log(maxX, minX);

let rocksY = rocks.map(r => r.map(it => it[1]));
let [maxY, minY] = [max(flatten(rocksY)), min(flatten(rocksY))];
minY = 0;
console.log(maxY, minY);

let map = new Map(0 as number, maxX as number + 500,   minY as number, maxY as number, (maxY as number)+2);
for (const line of rocks) {
    let start = new Vec(line[0][0], line[0][1]);
    for (let i = 1; i < line.length; i++) {
        let end = new Vec(line[i][0], line[i][1]);
        let dir = end.sub(start).shorten();
        map.putRock(start.x, start.y);
        while (!(end.x == start.x && end.y == start.y)) {
            start = start.add(dir);
            map.putRock(start.x, start.y);
        }
    }
}

map.print();
let sand = new Vec(500, 0);
let count = 0;
while(!map.isOutside(sand.x, sand.y)){
    sand = new Vec(500, 0);
    console.log(count)
    if (count == 1003) {
        console.log();
        
    }
    let moved = false;
    // if (count == 21){
    //     console.log("xx");
        
    // }
    do {

        // map.putSand(sand.x, sand.y);
        // map.print();
        // console.log()
        // map.delete(sand.x, sand.y);

        moved = false;
        // find where it hits first y
        while (!map.isOutside(sand.x, sand.y) && map.isFree(sand.x, sand.y + 1)) {
            sand = sand.add(new Vec(0, 1));
        }
        // try move left or right
        for (let nextTry of [
            new Vec(-1, 1),
            new Vec(1, 1),
        ]) {
            let test = sand.add(nextTry);
            if (map.isFree(test.x, test.y) || map.isOutside(test.x, test.y)) {
                sand = test;
                moved = true;
                break;
            }
        }
    } while (moved && !map.isOutside(sand.x, sand.y));
    if (!map.isOutside(sand.x, sand.y)){
        map.putSand(sand.x, sand.y);
        count++;
    }
    // console.log();
    
    // map.print()
    if (sand.x == 500 && sand.y == 0){
        map.print();
        break;
    }
}
console.log(count);
