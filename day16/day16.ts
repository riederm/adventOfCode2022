
import * as fs from 'fs';


let lines = fs
    .readFileSync('input.test.txt').toString()
    .split("\n");

class Edge{
    constructor(public target: string, public cost: number){}
}

let flowRates = new Map<string, number>();
let edges = new Map<string, Edge[]>();

function getSpanTreeFor(start: string, edges: Map<string, number[]>) : Map<string, number> {
    let queue : string[] = [];
}

for (const l of lines) {
    let groups = /Valve (.+) has flow rate=(.+); tunnels? leads? to valves? (.*)/gm.exec(l);
    let name = ''+groups[1]; 
    let rate = +groups[2];
    let neighbours = (''+groups[3]).split(", ");

    edges.set(name, neighbours.map(it => new Edge(it, 1)));
    flowRates.set(name, rate);
}

//expand edges
for (const n of edges.keys()) {
    let knownTargets = new Set(...edges.get(n).map(it => it.target));
    for (const nn of edges.keys()) {
        if (!knownTargets.has(nn)) {

        }
    }

    
    
}

console.log(flowRates);;
console.log(edges);

let max = -1;

function walk(pos: string, pressure: number, remainingMinutes: number, visited: Set<string>){
    // end?
    if (remainingMinutes==0){
        return
    }
    pressure += flowRates.get(pos)*Math.max(0,(remainingMinutes-1)); //we just opened it, it will flow from next minute on
    if (pressure > max) {
        max = pressure
        console.log(max, remainingMinutes);
        
    }
    
    let neighbous = edges.get(pos);
    for (const n of neighbous) {
        visited.add(n);
        walk(n, pressure, remainingMinutes-1);
        visited.delete(n);
    }    
}

walk("AA", 0, 30);
console.log(max);
