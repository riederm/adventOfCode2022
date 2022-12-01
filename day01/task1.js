

function getInput() {
    var fs = require('fs');
    const lines = fs.readFileSync('input1.txt').toString().split("\n");

    cals = []; 
    sum = 0; 
    for(l of lines) {
        sum += +l;
        if ( l == ''){
            cals.push(sum)
            sum = 0;
        }
    }
    return cals
}
cals = getInput();
cals.sort((a,b) => b - a);
console.log(Math.max(...cals));
console.log(cals.slice(0,3).reduce((a,b) => a+b, 0));
