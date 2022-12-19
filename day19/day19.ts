import assert from 'assert';
import * as fs from 'fs';
import { stringify } from 'querystring';

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

    builds.push(undefined); //build nothing
    for (const [targetOre, robot] of Array.from(bp.robots.entries()).reverse()) {
        if (Array.from(robot.entries()).every(([ore, costs]) => (res.get(ore) ?? 0) >= costs)) {
            builds.push(targetOre);
        }
    }
    return builds.reverse();
}

function farm(res: Map<string, number>, robots: Map<string, number>) {
    for (const [oreType, amount] of robots.entries()) {
        res.set(oreType, (res.get(oreType) ?? 0) + amount);
    }
}

function payForConstruction(bp: BluePrint, res: Map<string, number>, robots: Map<string, number>, type: string) {
    let costs = bp.robots.get(type);
    for (const [ore, amount] of costs.entries()) {
        let newAmount = res.get(ore) - amount;
        if (newAmount < 0) {
            console.log("illegal amount")
        }
        res.set(ore, newAmount)
    }
}

let m = -1;
function testBluePrint(bp: BluePrint, res: Map<string, number>, robots: Map<string, number>, remainingMinutes: number,
    pendingBuild: string): number {
    if (remainingMinutes <= 0) {
        let x = res.get("geode") ?? 0;
        if (x > m) {
            m = x;
            console.log(m);
        }
        return x;
    }

    let innerMax = -1;
    let possBuilds = getPossibleBuilds(bp, res);

    for (const nextBuild of possBuilds) {
        console.log(remainingMinutes, possBuilds);
        
        if (remainingMinutes + (res.get("geode") ?? 0) < m) {
            console.log("skip", m);
            continue;
        }
        let newRes = new Map(res);
        let newRobots = new Map(robots);
        //collect resources
        farm(newRes, newRobots);
        //perform pending build
        if (pendingBuild) {
            newRobots.set(pendingBuild, (newRobots.get(pendingBuild) ?? 0) + 1);
        }
        if (nextBuild) {
            payForConstruction(bp, newRes, newRobots, nextBuild);
        }
        innerMax = Math.max(innerMax, testBluePrint(bp, newRes, newRobots, remainingMinutes - 1, nextBuild));
    }
    return innerMax;
}

function testBFS(bp: BluePrint, res: Map<string, number>, robots: Map<string, number>, remainingMinutes: number,
    pendingBuild: string) {

    let q: [Map<string, number>, Map<string, number>, number, string, number][] = [[new Map(res), new Map(robots), remainingMinutes, undefined, 0]];
    let i = 0;
    while (q.length > 0) {
        let [res, robots, remainingMinutes, pendingBuild, lvl] = q.shift();
        if (i++ % 10000 == 0) {
            console.log(lvl, res, robots);
        }
        let x = res.get("geode") ?? 0;
        if (x > m) {
            m = x;
            console.log(m);
        }

        if (remainingMinutes == 0) {
            continue;
        }

        let possBuilds = getPossibleBuilds(bp, res);
        for (const nextBuild of possBuilds) {
            if (remainingMinutes + (res.get("geode") ?? 0) < m) {
                console.log("skip", m);
                continue;
            }
            let newRes = new Map(res);
            let newRobots = new Map(robots);
            //collect resources
            farm(newRes, newRobots);
            //perform pending build
            if (pendingBuild) {
                newRobots.set(pendingBuild, (newRobots.get(pendingBuild) ?? 0) + 1);
            }
            if (nextBuild) {
                payForConstruction(bp, newRes, newRobots, nextBuild);
            }

            q.push([newRes, newRobots, remainingMinutes - 1, nextBuild, lvl + 1]);
        }
    }
}

for (const bp of blueprints) {    //todo reverse
    m = -1;
    console.log(bp.id, testBluePrint(bp, new Map(), new Map([["ore", 1]]), 24, undefined));
}