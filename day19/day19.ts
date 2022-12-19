import assert from 'assert';
import * as fs from 'fs';
import { type } from 'os';
import { resourceUsage } from 'process';
import { stringify } from 'querystring';

let lines = fs.readFileSync('input.txt').toString()
    .split("\n")

enum Resource {
    None = 0,
    ore,
    clay,
    obsidian,
    geode
};

const RESOURCES = [Resource.None, Resource.ore, Resource.clay, Resource.obsidian, Resource.geode];

function emptyResources(): number [] {
    return [0,0,0,0,0];
}

function resName(res: Resource) : string {
    return Resource[res];
}

class BluePrint {
    constructor(public id: number, public robotCosts: Map<Resource, number[]>) {
    }
}

let blueprints = lines.map((l) => {
    let id = +/Blueprint (\d+):/gm.exec(l)[1];
    let regex = /Each (\w+) robot costs (\d+) (\w+)( and (\d+) (\w+))?./gm;
    var robot;
    let costsPerRobot = new Map<Resource, number[]>();
    do {robot = regex.exec(l);
        if (robot) {
            let costs = emptyResources();
            costs[Resource[robot[3]]] = +robot[2];
            if (robot[4]) {
                costs[Resource[robot[6]]] = +robot[5];
            }
            costsPerRobot.set(Resource[''+robot[1]], costs);
        }
    } while (robot)
    costsPerRobot.set(Resource.None, [0,0,0,0,0])
    return new BluePrint(id, costsPerRobot);
})

blueprints.forEach(bp => {
    let robotLines = Array.from(bp.robotCosts.entries()).map(([res, costs]) =>
        `   Robot ${resName(res)}: ${costs}`).join("\n");
    console.log(bp.id, "\n", robotLines);
});

let mm = -1;
function test(bp: BluePrint, remainingMinutes: number, resources: number[], robots: number[], maxRobots: number[], seen: Map<string, number>) {
    if(remainingMinutes == 0) {
        if (resources[Resource.geode] > mm) {
            mm = resources[Resource.geode];
            // console.log(mm, robots);
        }
        return resources[Resource.geode];
    }
    let key = resources.join(",") + robots.join(",") + remainingMinutes;
    if (seen.has(key)){
        return seen.get(key);
    }

    let buildOptions = Array.from(bp.robotCosts)
        .filter(([resource, costs]) => costs.every((c,i) => c <= resources[i]))
        .map(([r, _]) => r);

    let maxGeodes = -1;
    for (const nextRobot of buildOptions) {
        if ((nextRobot == Resource.ore || nextRobot == Resource.clay) && remainingMinutes < 6) {    //heuristic!?!
            continue;
        }

        if (robots[nextRobot] < maxRobots[nextRobot]){

            //farm the current round
            let _resources = [...resources]; //copy
            robots.forEach((amount, i) => _resources[i] += amount);
            
            //build the next robot
            bp.robotCosts.get(nextRobot).forEach((cost, idx) => _resources[idx] -= cost)
            let _robots = [...robots]; //copy
            _robots[nextRobot]++;
            
            let curr = test(bp, remainingMinutes-1, _resources, _robots, maxRobots, seen);
            seen.set(key, curr);
            if (curr > maxGeodes){
                maxGeodes = curr;
            }
        }
    }
    return maxGeodes;
}

let bp = blueprints[0];
let sum = 0;
blueprints.forEach(bp => {
    mm = -1;
    let maxRobots : number[] = [];
    for (const R of RESOURCES) {
        let max = Math.max(...Array.from(bp.robotCosts.values()).map(n => n[R]));
        maxRobots.push(max);
    }
    maxRobots[Resource.None] = 999;
    maxRobots[Resource.geode] = 999;

    let res = test(bp, 24, [0,0,0,0,0], [0,1,0,0,0], maxRobots, new Map())
    console.log("BP", bp.id, res);
    sum = sum + bp.id * res;
})

console.log("expected", 1958, "actual", sum);