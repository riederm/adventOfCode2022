var cals = require('fs')
        .readFileSync('input1.txt').toString().split("\n\n")
        .map(cals => cals.split("\n")
            .map(it => +it)
            .reduce((a,b) => a+b, 0))

cals.sort((a,b) => b - a);
console.log(Math.max(...cals));
console.log(cals.slice(0,3).reduce((a,b) => a+b, 0));
