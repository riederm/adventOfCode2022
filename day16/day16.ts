
import * as fs from 'fs';


let lines = fs
    .readFileSync('input.txt').toString()
    .split("\n");

class Edge {
    constructor(public target: string, public cost: number) { }
}

let flowRates = new Map<string, number>();
let edges = new Map<string, Edge[]>();

function dijkstra(start: string) {
    let distance = new Map<string, number>();
    let q: string[] = [];
    for (const k of flowRates.keys()) {
        distance.set(k, Infinity);
        q.push(k);
    }
    distance.set(start, 0);
    q.sort((a, b) => distance.get(a) - distance.get(b));


    while (q.length > 0) {
        let current = q.shift();
        for (const n of edges.get(current).filter(it => q.indexOf(it.target) >= 0)) {
            let alt = distance.get(current) + n.cost;
            if (alt < distance.get(n.target)) {
                distance.set(n.target, alt);
                q.sort((a, b) => distance.get(a) - distance.get(b));
            }
        }
    }
    return distance;
}

for (const l of lines) {
    let groups = /Valve (.+) has flow rate=(.+); tunnels? leads? to valves? (.*)/gm.exec(l);
    let name = '' + groups[1];
    let rate = +groups[2];
    let neighbours = ('' + groups[3]).split(", ");

    edges.set(name, neighbours.map(it => new Edge(it, 1)));
    flowRates.set(name, rate);
}

//expand edges
for (const n of edges.keys()) {
    let expandedEdges = dijkstra(n);
    let targets = Array.from(expandedEdges.entries())
        .map(([t, c]) => new Edge(t, c))
        .filter(it => it.cost > 0 && it.cost < 9999999999);

    edges.set(n, targets)
}

console.log(flowRates.size);;
console.log(edges);

let max = -1;
function walk(pos: string, pressure: number, remainingMinutes: number, visited: Set<string>) {
    if (remainingMinutes <= 0) {
        return pressure;
    }

    pressure += flowRates.get(pos) * remainingMinutes; //we just opened it, it will flow from next minute on
    max = Math.max(max, pressure);

    let neighbous = edges.get(pos).filter(it => !visited.has(it.target))
        .filter(it => flowRates.get(it.target) > 0);

    for (const n of neighbous) {
        visited.add(n.target);
        walk(n.target, pressure, remainingMinutes - (n.cost + 1), visited);
        visited.delete(n.target);
    }
}
max = -1;
walk("AA", 0, 30, new Set());
console.log("a)", max);

function walk2(pos1: string, pos2: string, pressure: number, remainingMinutes1: number, remainingMinutes2: number, visited: Set<string>) {
    if (remainingMinutes1 <= 0 && remainingMinutes2 <= 0) {
        return pressure;
    }

    let m = max;
    pressure += flowRates.get(pos1) * remainingMinutes1; //we just opened it, it will flow from next minute on
    m = Math.max(max, pressure);
    pressure += flowRates.get(pos2) * remainingMinutes2; //we just opened it, it will flow from next minute on
    m = Math.max(max, pressure);
    if (m > max){
        max = m;
        console.log(m);
    }

    let neighbous1 = edges.get(pos1).filter(it => !visited.has(it.target))
        .filter(it => flowRates.get(it.target) > 0)
        .filter(_=> remainingMinutes1 > 0);

    for (const n1 of neighbous1) {
        visited.add(n1.target);
        let neighbous2 = edges.get(pos2).filter(it => !visited.has(it.target))
            .filter(it => flowRates.get(it.target) > 0)
            .filter(_=> remainingMinutes2 > 0);
        for (const n2 of neighbous2) {

            visited.add(n2.target);
            walk2(n1.target, n2.target, pressure, remainingMinutes1 - (n1.cost + 1), remainingMinutes2 - (n2.cost +1), visited);
            visited.delete(n2.target);
        }
        visited.delete(n1.target);
    }
}

walk2("AA","AA", 0, 26, 26, new Set());
// this will not end ... try the solution after it settles down for a minute or two
console.log("b)", max);