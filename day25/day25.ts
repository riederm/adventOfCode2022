
import * as fs from 'fs';
const digit = {
    '=': -2,
    '-': -1,
    '0': 0,
    '1': 1,
    '2': 2,
};

function resolve(snfu: string): number {
    return snfu.split("").reverse()
        .map((d, i) => digit[d] * Math.pow(5, i))
        .reduce((a, b) => a + b, 0)
}

let numbers = fs.readFileSync("input.txt").toString().split("\n");
let bob = numbers.map(n => resolve(n)).reduce((a, b) => a + b, 0);
console.log(bob);

function snafu(target: number): string {
    let pos = 20;
    return snafu_rec(0, "0", pos);

    function snafu_rec(current: number, snafu: string, digitPos: number): string {
        if (digitPos > 0) {
            let next_pos = digitPos -1;
            let next_digit = Math.pow(5, next_pos);
            if (current > target) { // too big, so remove something
                let [lower, upper] = [current - (2 * next_digit), current - (1 * next_digit)];
                if (upper < target && lower < target) {
                    return snafu_rec(upper, snafu + "-", next_pos)
                        ?? snafu_rec(current, snafu + "0", next_pos);
                } else if (upper > target && lower < target) {
                    return snafu_rec(upper, snafu + "-", next_pos)
                        ?? snafu_rec(lower, snafu + "=", next_pos);
                } else {
                    return snafu_rec(lower, snafu + "=", next_pos);
                }
            } else if (current < target) { // too small, so add something
                let [upper, lower] = [current + (2 * next_digit), current + (1 * next_digit)];
                // both are lower, so we need to go with 2
                if (upper < target) {
                    return snafu_rec(upper, snafu + "2", next_pos);
                } else if (lower < target) {
                    //try both
                    return snafu_rec(upper, snafu + "2", next_pos)
                        ?? snafu_rec(lower, snafu + "1", next_pos);
                } else {
                    // lower is also bigger, so we need 0 or lower
                    return snafu_rec(current, snafu + "0", next_pos)
                        ?? snafu_rec(lower, snafu + "1", next_pos);
                }
            } else {
                // correct, add rest "0"
                return snafu_rec(current, snafu + "0", next_pos);
            }
        } else if (current == target) {
            return snafu;
        }
        // no luck
        return undefined;
    }


}

console.log(snafu(bob));