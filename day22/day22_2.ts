
import assert from 'assert';
import * as fs from 'fs';
import { createSecureContext } from 'tls';

class Vec {
    public key: string;
    constructor(public x: number, public y: number) {
        this.key = `${x},${y}`;
    }

    add(other: Vec): Vec {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    isHorizontal() : boolean {
        return this.y == 0;
    }
}

const E =    new Vec(1, 0);   //right
const S =    new Vec(0, 1);  //down
const W =    new Vec(-1, 0);  //left
const N =    new Vec(0, -1);   //up


const directions = [
    E,   //right
    S,  //down
    W,  //left
    N   //up
]

const dirText = [">", "v", "<", "^"];

let dir = 0;

class Tile{
    constructor(public id:number,public  x: number,public  y:number, public connections: Map<Vec, Connection> = new Map()){}
}

class Connection{
    constructor(public targetId: number, public dir: Vec, correction :(v: Vec) => Vec){}
}

const n = 51
let tiles : Tile[] = [
    new Tile(1, 1 * n, 0 * n),
    new Tile(2, 2 * n, 0 * n),
    new Tile(3, 1 * n, 1 * n),
    new Tile(4, 1 * n, 2 * n),
    new Tile(5, 0 * n, 2 * n),
    new Tile(6, 0 * n, 3 * n),
];

const IDENTITY = (v: Vec) => v;
const ROTATE_RIGHT = (v: Vec) => new Vec(v.y, v.x);
const [T1, T2, T3, T4, T5, T6] = [tiles[0], tiles[1], tiles[2], tiles[3], tiles[4], tiles[5]];
T1.connections.set(N, new Connection(6, W, ROTATE_RIGHT));
T1.connections.set(S, new Connection(3, N, IDENTITY));
T1.connections.set(E, new Connection(2, W, IDENTITY));
T1.connections.set(W, new Connection(5, W, IDENTITY));

T2.connections.set(N, new Connection(6, S, v => new Vec(v.x, n-1)));
T2.connections.set(S, new Connection(3, E, v => new Vec(n-1 , v.x)));
T2.connections.set(E, new Connection(4, E, v => new Vec(n-1, v.y)));
T2.connections.set(W, new Connection(1, E, v => ));

T3.connections.set(N, new Connection(1, S));
T3.connections.set(S, new Connection(4, N));
T3.connections.set(E, new Connection(2, S));
T3.connections.set(W, new Connection(5, N));

T4.connections.set(N, new Connection(3, S));
T4.connections.set(S, new Connection(6, E));
T4.connections.set(E, new Connection(2, E));
T4.connections.set(W, new Connection(5, E));

T5.connections.set(N, new Connection(3, W));
T5.connections.set(S, new Connection(6, N));
T5.connections.set(E, new Connection(4, W));
T5.connections.set(W, new Connection(1, W));

T6.connections.set(N, new Connection(5, S));
T6.connections.set(S, new Connection(2, N));
T6.connections.set(E, new Connection(4, S));
T6.connections.set(W, new Connection(1, N));

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

let pos = new Vec(0,0);
let currenTile = tiles[0];

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

        let exitDirection : Vec = undefined;
        if (pos.x >= 50) {
            exitDirection = E;
        } else if (pos.x < 0) {
            exitDirection = W;
        }else if (pos.y < 0) {
            exitDirection = N;
        }else if (pos.y >= 50) {
            exitDirection = S;
        }

        pos.y = (pos.y + n) % n;
        pos.x = (pos.x + n) % n;

        let currentDir = directions[dir];
        if (exitDirection) {
            let exitConnection = currenTile.connections.get(exitDirection);
            let nextTile = tiles[exitConnection.targetId];
            //update direction
            let nextDir = exitConnection.dir;
            if (directions[dir].isHorizontal() && nextDir.isHorizontal()){


            }
            dir = nextDir;
        }

    }
}

console.log(pos, dir);
map.forEach(l =>
    console.log("|" + l.join("") + "|"));

console.log((pos.y+1)*1000 + 4 * (pos.x+1) + (dir%directions.length));
