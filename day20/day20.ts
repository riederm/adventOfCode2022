
import * as fs from 'fs';

let arr = fs
    .readFileSync('input.test.txt').toString()
    .split("\n").map(it => +it);

class Node{
    public next: Node = undefined;
    public prev: Node = undefined;
    constructor(public val: number){
    }

    move(){
        if (this.val > 0) {
            // move right
            let P = this.prev;
            let N = this.next;
            let NN = this.next.next;

            P.next = N;

            N.prev = P;
            N.next =this;
            
            this.prev = N;
            this.next = NN;

            NN.prev = this;
        }else{
            // move left
            let P = this.prev;
            let N = this.next;
            let PP = this.prev.prev;

            PP.next = this;

            this.prev = PP;
            this.next = P;

            P.prev = this;
            P.next = N;

            N.prev = P;
        }
    }
}
let nodes : Node[] =[];
for (let i = 0; i < arr.length; i++) {
    nodes.push(new Node(arr[i]));
    if (i>0){
        nodes[i].prev = nodes[i-1];
        nodes[i-1].next = nodes[i];
    }
}
nodes[0].prev = nodes[nodes.length-1];
nodes[nodes.length-1].next = nodes[0];


function find(val: number): Node {
    let start = nodes[0];
    let n = nodes[0];
    while(n.val != val) {
        n = n.next; 
        if (n === start) {
            console.log("cannot find", val)
            return undefined;
        }
    }
    return n;
}

function print(mult:number = 1){
    let str = '';
    let start = nodes[0];
    let n = nodes[0];
    do{
        str += n.val*mult + ", ";
        n = n.next;
    }while(n !== start);
    console.log(str);
}
console.log(nodes.map(it => it.val))
for (let i = 0; i < 10; i++) {
    
    for (const nn of nodes) {
        //find n
        let n = nn;
        // console.log("moving ", n.val);
        for (let i = 0; i < (Math.abs(n.val) * 811589153) % nodes.length; i++) {
            n.move();
        }
        // print();
    }

    print(811589153);
}
// for (const v of arr) {
//     //find n
//     let n = find(v);
//     console.log("moving ", n.val);
//     for (let i = 0; i < Math.abs(n.val); i++) {
//         n = n.move();
//     }
// }

let v = find(0);
let numbers : number[] = [];
for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 1000; i++) {
        v = v.next;
    }
    numbers.push(v.val);
}
console.log(numbers);
console.log(numbers.reduce((a,b) => a+b));