const cards = require('./app.js');
let game = cards.createGame(1, 1);
let splitRules = {};
let decisionRules = {};

function decision(ruleSet) {
	//	split(player.current, dealerShow);


	let eval = 'H';
	do {
		eval = evaluate(ruleSet, player.current, dealerShow);

		switch (eval) {
			case 'D':
				bet *= 2;
				giveCard(player, dck, shoeSize);
				break;
			case 'H':
				giveCard(player, dck, shoeSize);
				break;
			case 'Ds':
			default:
				break;
		}

	} while (eval === 'H');

	while (handValue(dealer.current) <= 17) {
		giveCard(dealer, dck, shoeSize);
	}

}

function loop() {
	bet();
	initial();
	split();
	double();
	decide();
	resolve();
}

function bet() {
	console.log('Bet');
	game.Players.forEach(player => {

	});
}

function initial() {
	console.log('Initial');

	cards.initialDeal(game);
}

function split() {

	console.log('Split');
}

function double() {
	console.log('Double');
}

function decide() {
	console.log('Decide');
}

function resolve() {
	console.log('Resolve');
}


loop();

