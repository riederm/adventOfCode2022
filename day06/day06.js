let buf = require('fs')
    .readFileSync('input.txt').toString().split('');

let n = 14; //for a) n=4

for (let i = n; i < buf.length; i++) {
    let temp = [];
    let unique = true;
    for (let j = 0; j < n; j++) {
        let s = buf[i-j];
        unique &= temp[s] !== 1;
        temp[s] = 1;
    }
    if (unique) {
        console.log(i+1);
        break;
    }
}
