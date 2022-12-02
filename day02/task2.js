// A = X = ROCK
// B = Y = PAPER
// C = Z = SCISSORS

const game_points = {
	R:  {R:3, P: 0, S: 6},
	P:  {R:6, P: 3, S: 0},
	S:  {R:0, P: 6, S: 3},
}
const choice_points = {R: 1, P: 2, S: 3};

function eval(other, me) {
	return game_points[me][other] + choice_points[me];
}

const translate = {A: 'R', X:'R', B:'P', Y:'P', C:'S', Z:'S'};
const game = require('fs')
	.readFileSync('input.txt').toString().split('\n')
	.map(l => l.split(' ').map(it => translate[it]));

const score1 = game.map(g => eval(g[0], g[1])).reduce((a, b) => a + b, 0);
console.log(score1);

const strategy = {
	R:  {R: 'S', P: 'R', S: 'P'},	//lose
	P:  {R: 'R', P: 'P', S: 'S'},	//draw
	S:  {R: 'P', P: 'S', S: 'R'},	//win
}

for (const line of game) {
	const other = line[0];
	const me = line[1];
	line[1] = strategy[me][other];
}

const score2 = game.map(g => eval(g[0], g[1])).reduce((a, b) => a + b, 0);
console.log(score2);