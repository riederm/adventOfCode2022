
import assert from 'assert';
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

const directions = [
    new Vec(1, 0),   //right
    new Vec(0, 1),  //down
    new Vec(-1, 0),  //left
    new Vec(0, -1)   //up
]

    const dirText = [">", "v", "<", "^"];

let dir = 0;

let inputs = fs
    .readFileSync('input.txt').toString()
    .split("\n\n");

let map = inputs[0].split("\n")
    .map(it => it.split(""));

let maxWidth = Math.max(...map.map(l => l.length))
map.forEach(l => {
    while (l.length < maxWidth) {
        l.push(" ");
    }
});
map.forEach(l =>
    console.log("|" + l.join("") + "|"));


let input = inputs[1].split(/(R|L)/g);
console.log(input);

let pos = new Vec(map[0].indexOf("."), 0);
for (const i of input) {
    let num = parseInt(i);
    if (isNaN(num)) {
        //turn
        if (i == "L"){
            dir = (dir-1 + directions.length) % directions.length;
        }else if (i == "R") {
            dir = (dir+1 + directions.length) % directions.length;
        }else{
            assert(false, "unknown direction " + i);
        }
    }else{
        //walk
        let nextPos : Vec = pos;
        while (num > 0) {
            nextPos = nextPos.add(directions[dir]);
            nextPos.y = (nextPos.y + map.length) % map.length;
            nextPos.x = (nextPos.x + map[0].length) % map[0].length;
            let field = map[nextPos.y][nextPos.x];
            if (field == "."){
                pos = nextPos;
                //map[nextPos.y][nextPos.x]=dirText[dir];
                num--;
            }else if (field == "#"){
                num = 0;
            }
        }
    }
}

console.log(pos, dir);
map.forEach(l =>
    console.log("|" + l.join("") + "|"));

console.log((pos.y+1)*1000 + 4 * (pos.x+1) + (dir%directions.length));
