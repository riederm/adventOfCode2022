
import * as fs from 'fs';

let pairs = fs
    .readFileSync('input.test.txt').toString()
    .split("\n\n");


function flatten(array: any[]): number[] {
    let result: number[] = [];
    for (const e of array) {
        if (Array.isArray(e)) {
            result.push(...flatten(e));
        } else {
            result.push(e);
        }
    }
    return result;
}

function ensureArray(x: any): any[]{
    if (Array.isArray(x)) {
        return x;
    }
    return [x];
}

function rightOrder(left: any[], right: any[], depth: number =0, pre: string = ""): boolean {
    while (left.length > 0 && right.length > 0) {
        let l = left.shift();
        let r = right.shift();

        console.log(pre, "comparing: ", l, r)
        if (Array.isArray(r) || Array.isArray(l)){
            if (!rightOrder(ensureArray(l), ensureArray(r), depth+1, pre + "  ")) {
                return false;
            }else{
                //return true;
            }
        } else if (r < l) {
            /// wrong order
            return false;
        }
    }
    if (left.length > right.length) {
        return !left.some(it => Array.isArray(it));
    }else{
        return true;
    }
}
console.log(rightOrder([7,7,7,7], [7,7,7]));
let correct = [];
console.log(pairs);
for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split("\n");
    
    let left = eval(pair[0]) as any[];
    let right = eval(pair[1]) as any[];
    console.log(left, right);

    if (rightOrder(left, right)) {
        correct.push(i+1);
    }

}

console.log(correct);
