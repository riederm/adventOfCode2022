let buf = require('fs')
    .readFileSync('input.txt').toString().split("\n");


var hdd = {};
var path = [];

function currentFolder() {
    let current = hdd;
    for (const d of path) {
        current = current[d];
    }
    return current;
}


for (let i = 0; i < buf.length; i++) {
    let cmd = buf[i];
    if (cmd[0] == "$") {
        cmd = cmd.replace("$ ", "");
        let segs = cmd.split(" ");
        switch (segs[0]) {
            case "cd":
                if (segs[1] == "/") {
                    path = [];
                } else if (segs[1] == "..") {
                    path.pop();
                } else {
                    path.push(segs[1])
                }
                break;
            case "ls":
                let location = currentFolder();
                
                do {
                    i++;
                    cmd = buf[i];
                    let segs = cmd.split(" ");
                    if (segs[0] == "dir") {
                        if (location[segs[1]] === undefined){
                            location[segs[1]] =[];
                                                }
                    } else {
                        location[segs[1]] = +segs[0];
                    }
                } while (buf.length > i+1 && buf[i + 1][0] !== "$");
                break;
            } 
        }
    }



function calc_size(currentpath, location, all) {
    let size =0;
       
    for (const key in location) {
        let c = location[key];
        if (typeof c =='number'){
            size+=c;
        }else{
            size+=calc_size(currentpath + "/" + key, c, all);
        }
    }
    all.push({name: currentpath, size});
    return size;
}   

let all =  [];
all.push({name:"/", size:calc_size("", hdd, all)});
console.log("a)", all.filter(it => it.size <= 100000)
                    .reduce((a,b)=> a + b.size, 0));

const max = 70000000;
const target = 30000000;
const root = all.find(it => it.name == "/");
const free = max -root.size;
const toFree = target-free;
let x = all.filter(it => it.size>= toFree).sort((a,b)=> a.size - b.size)[0].size;
console.log("b)", x);