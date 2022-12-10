import * as fs from 'fs';

let lines = fs
    .readFileSync('input.txt').toString()
    .split("\n").map(it => it.split(" "));

let result : number[] = [];
let signal = 1
for (const l of lines) {
    if (l[0] == "noop") {
            result.push(signal);
    }else { //addX
            // takes two cycles
            result.push(signal);
            result.push(signal);
            signal+= (+l[1]);
    }
}

//a)
console.log([20, 60, 100, 140, 180, 220]
                .map(it => result[it-1]*it).reduceRight((a,b) => a+b));

//b)
const w = 40;
let currentLine = Array(w).fill(".");
for(let j = 0; j < result.length / w; j++){
    for (let i = 0; i < w; i++) {
        let pos = result[i+(j*w)]-1;
        if (i >= pos && i < pos+3){
            currentLine[i] = '#'
        }
    }
    console.log(currentLine.join(""));
    currentLine = Array(w).fill(".");
}