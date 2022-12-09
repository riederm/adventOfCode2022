
import * as fs from 'fs';

let buf = fs
    .readFileSync('input.txt').toString()
    .split("\n").map(it => it.split(" "));

class Vec {
    constructor(public x: number, public y: number) { }

    add(other: Vec) {
        this.x += other.x;
        this.y += other.y;
    }

    follow(other: Vec) {
        let deltaX = other.x - this.x;
        let deltaY = other.y - this.y;
        let step = new Vec(0,0);
        // manhatten >= 2
        if (Math.abs(deltaX) >= 2 || Math.abs(deltaY) >= 2) {
            if (deltaX <= -1) {
                step.x = -1;
            } else if (deltaX >= 1) {
                step.x = 1;
            }
            if (deltaY <= -1) {
                step.y = -1;
            } else if (deltaY >= 1) {
                step.y = 1;
            }
        }
        this.add(step);
    }
}


const dir: any = {
    'L': new Vec(-1, 0),
    'R': new Vec(1, 0),
    'U': new Vec(0, 1),
    'D': new Vec(0, -1),
}

//a
{
    let [h,t] = [new Vec(0, 0), new Vec(0,0)];
    let visited = new Set<string>();
    for (let line of buf) {
        let [step, count] = [dir[line[0]], +line[1]];
        for (let i = 0; i < count; i++) {
            h.add(step);
            t.follow(h);
            visited.add(`${t.x}, ${t.y}`);
        }
    }
    console.log(visited.size);
}

//b
{
    const n = 10;
    let knots: Vec[] = [];
    for (let i = 0; i < n; i++) {
        knots.push(new Vec(0,0));
    }
    let h = knots[0];
    let t = knots[n-1];
    let visited = new Set<string>();
    for (let line of buf) {
        let [step, count] = [dir[line[0]], +line[1]];
        for (let i = 0; i < count; i++) {
            h.add(step);
            for(let k = 1; k < n; k++){
                knots[k].follow(knots[k-1]);
            }
            visited.add(`${t.x}, ${t.y}`);
        }
    }
    console.log(visited.size);
}