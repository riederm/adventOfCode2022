import assert from 'assert';
import * as fs from 'fs';

interface Expression{
    // a
    eval(memory: Map<string, Expression>): number;
    // b
    evalWithTarget(memory: Map<string, Expression>, target: number);
}

class Ref implements Expression {
    constructor(public ref: string){}
    evalWithTarget(memory: Map<string, Expression>, target: number) {
        return memory.get(this.ref).evalWithTarget(memory, target);
    }
    
    eval(memory: Map<string, Expression>): number {
        return memory.get(this.ref).eval(memory);
    }
}

class Number implements Expression {
    constructor(public name, public val: number){}
    
    evalWithTarget(memory: Map<string, Expression>, target: number) {
        return target;
    }
    
    eval(memory: Map<string, Expression>): number {
        return this.val;
    }
}

class Term implements Expression{
    constructor(public name, public left: Expression, public op: string, public right: Expression){}

    evalWithTarget(memory: Map<string, Expression>, target: number) {
        // test if left or right is unknown
        let l = this.left.eval(memory);
        let r = this.right.eval(memory);

        let newTarget = 0;
        switch (this.op) {
            case "+": 
                newTarget= isNaN(l) ? target-r: target-l;break;
            case "-":
                newTarget= isNaN(l) ? target+r: l-target;break;
            case "*":
                newTarget= isNaN(l) ? target/r: target/l;break;
            case "/":
                newTarget = isNaN(l) ? target*r: l/target; break;
            default:
                assert(false, "evalWithTarget" + this.op);
        }
        if (isNaN(l)){
            this.left.evalWithTarget(memory, newTarget);
        }else{
            this.right.evalWithTarget(memory, newTarget);
        }
    }

    eval(memory: Map<string, Expression>): number {
        let l = this.left.eval(memory);
        let r = this.right.eval(memory);
        let result = 0;
        switch (this.op) {
            case "+":
                result= l + r; break;
            case "-":
                result= l - r;break;
            case "*":
                result= l * r;break;
            case "/":
                result= l / r;break;
            default:
                assert(false, "eval " + this.op);
        }
        return result;
    }
}

let arr = fs
    .readFileSync('input.txt').toString()
    .split("\n").map(l => {
    let segments = l.split(": ");
    let name = segments[0];

    let terms = segments[1].split(" ");
    if (terms.length == 1){
        let x = parseInt(terms[0]);
        if (isNaN(x)){
            assert(false, "not a number: " + terms[0]);
        }else{
            return new Number(name, x);
        }
    }else{
        return new Term(name, new Ref(terms[0]), terms[1], new Ref(terms[2]));
    }
});

let x = 0;
let memory = new Map<string, Expression>();
for (const e of arr) {
    memory.set(e.name, e);
}
console.log("a)", memory.get("root").eval(memory));


let root = memory.get("root") as Term;
class Human implements Expression {
    eval(memory: Map<string, Expression>): number {
        return NaN;
    }
    evalWithTarget(memory: Map<string, Expression>, target: number) {
        console.log("b) human:", target);
    }
}

memory.set("humn", new Human());
let l = root.left.eval(memory);
let r = root.right.eval(memory);

if (isNaN(l)){
    root.left.evalWithTarget(memory, r)
}else{
    root.right.evalWithTarget(memory, l)
}