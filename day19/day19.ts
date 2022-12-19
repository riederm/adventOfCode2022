import assert from 'assert';
import * as fs from 'fs';

let lines = fs.readFileSync('input.test.txt').toString()
    .split("\n")


class BluePrint {
    constructor(public id: number, public robots: Map<string, Map<string, number>>) {
    }
}

let blueprints = lines.map((l) => {
    let id = +/Blueprint (\d+):/gm.exec(l)[1];
    let regex = /Each (\w+) robot costs (\d+) (\w+)( and (\d+) (\w+))?./gm;
    var robot;
    let costs: Map<string, Map<string, number>> = new Map();
    do {
        robot = regex.exec(l);
        if (robot) {
            let costsPerOre = new Map<string, number>();
            costsPerOre.set(robot[3], +robot[2]);
            costs.set(robot[1], costsPerOre);
            if (robot[4]) {
                costsPerOre.set(robot[6], +robot[5]);
            }

        }
    } while (robot)
    return new BluePrint(id, costs);
})

blueprints.forEach(bp => {
    console.log(bp.id, bp.robots);

})

function getPossibleBuilds(bp: BluePrint, res: Map<string, number>): string[] {
    let builds: string[] = [];

    for (const [targetOre, robot] of bp.robots.entries()) {
        if (Array.from(robot.entries()).every(([ore, costs]) => (res.get(ore) ?? 0) >= costs)) {
            builds.push(targetOre);
        }
    }
    builds.push(undefined); //build nothing
    return builds;
}

function farm(res: Map<string, number>, robots: Map<string, number>) {
    for (const [oreType, amount] of robots.entries()) {
        res.set(oreType, (res.get(oreType) ?? 0) + amount);
    }
}

function construct(bp: BluePrint, res: Map<string, number>, robots: Map<string, number>, type: string) {
    let costs = bp.robots.get(type);
    for (const [ore, amount] of costs.entries()) {
        let newAmount = res.get(ore) - amount;
        if (newAmount < 0){
            console.log("illegal amount")
        }
        res.set(ore, newAmount)
    }
}

let m = -1;
function testBluePrint(bp: BluePrint, res: Map<string, number>, robots: Map<string, number>, remainingMinutes: number, 
    pendingBuild: string): number {
    if (remainingMinutes <= 0) {
        let x = res.get("geode")?? 0;
        if (x > m) {
            m = x;
            console.log(m);
        }
        return x;
    }

    let innerMax = -1;
    for (const nextBuild of getPossibleBuilds(bp, res)) {
        if (remainingMinutes + (res.get("geode")??0) < m){
            console.log("skip");
            
            continue;
        }
        //collect resources
        farm(res, robots);
        //perform pending build
        if (pendingBuild){
            robots.set(pendingBuild, (robots.get(pendingBuild)??0)+1);
        }
        if (nextBuild){
            construct(bp, res, robots, nextBuild);
        }
        innerMax = Math.max(innerMax, testBluePrint(bp, new Map(res), new Map(robots), remainingMinutes-1, nextBuild));
    }
    return innerMax;
}

for (const bp of blueprints) {    //todo reverse
    m = -1;
    console.log(testBluePrint(bp, new Map(), new Map([["ore", 1]]), 24, undefined));
}