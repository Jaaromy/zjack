const cuid = require('cuid');
const dynamo = require('aws-sdk/clients/dynamodb');
const dynamodb = new dynamo({region:'us-east-1'});

var params = {};
let ky = {'name': {S: 'soft1'}};
let tblnm = 'zjack-ruletables';

params.TableName = tblnm;
params.Key = ky;




// dynamodb.getItem(params, function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", JSON.stringify(data.Item));
//   }
// });

const suits = ['♤', '♡', '♢', '♧']
const value = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

function createDeck() {
	const deck = [];
	for (let i = 0; i < suits.length; i++) {
		for (let j = 0; j < value.length; j++) {
			deck.push(value[j] + suits[i]);
		}
	}

	return deck;
}

function durstenfeld(array) {
	// Modifies in place
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
}

function createRandomDeck(shoeSize) {
	shoeSize = shoeSize ? shoeSize : 1;
	cardCount = -2 * shoeSize;

	let deck = [];
	for (let i = 0; i < shoeSize; i++) {
		deck = deck.concat(createDeck());
	}

	return durstenfeld(deck).slice(0);
}

function createGame(playerCount, shoeSize) {
	let game = { Players: [], Dealer: {}, Deck: [], ShoeSize: shoeSize };

	for (let i = 0; i < playerCount; i++) {
		game.Players.push(createPlayer(1000, hardStratTable, softTotalTable, pairSplitTable, i + 1));
	}

	game.Dealer = createPlayer();

	game.Deck = createRandomDeck(shoeSize);

	return game;
}

function initialDeal(game) {
	for (let r = 0; r < 2; r++) {
		game.Players.forEach((player) => {
			giveCard(player.current.hands[0], game.Deck, game.ShoeSize);
		});

		giveCard(game.Dealer.current.hands[0], game.Deck, game.ShoeSize);
	}
}

function createPlayer(startingCash, hardRuleset, softRuleset, splitRuleset, id) {
	let pl = {};
	pl.id = id ? id : cuid.slug();

	pl.cash = startingCash ? startingCash : 0;
	pl.bet = 2;
	pl.hardRuleset = hardRuleset;
	pl.softRuleset = softRuleset;
	pl.splitRuleset = splitRuleset;
	pl.stats = {
		CashStart: startingCash,
		TotalWinDollar: 0,
		TotalLossDollar: 0,
		HighestCash: startingCash,
		LowestCash: startingCash,
		LargestWin: 0,
		LargestLoss: 0,
		Wins: 0,
		Losses: 0,
		Pushes: 0
	};
	pl.current = { hands: [[]] };
	pl.history = [];

	return pl;
}

function redSevenCount(card) {
	switch (card[0]) {
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
			return 1;
		case '7':
			if (card[1] === '♡' || card[1] === '♢') {
				return 1;
			} else {
				return 0;
			}
		case '8':
		case '9':
			return 0;
		default:
			return -1;
	}
}

function giveCard(hand, deck, shoeSize) {
	if (!deck || deck.length === 0) {
		deck.push(...createRandomDeck(shoeSize));
	}

	let card = deck.pop();

	hand.push(card);

	return card;
}

function handValue(hand) {
	let value = 0;
	let ace = false;
	for (let i = 0; i < hand.length; i++) {
		const card = hand[i];
		switch (card[0]) {
			case 'T':
			case 'J':
			case 'Q':
			case 'K':
				value += 10;
				break;
			case 'A':
				ace = true;
				value += 1;
				break;
			default:
				value += parseInt(card[0]);
				break;
		}
	}

	if (ace && value < 12) {
		value += 10;
	}

	return value;
}

const hardStratTable =
	{
		"name": "hard1",
		"schema": "ADD",
		"type": "HARD",
		"rules": {
	"21": {"2":"S", "3":"S", "4":"S", "5":"S", "6":"S", "7":"S", "8":"S", "9":"S", "T":"S", "J":"S", "Q":"S", "K":"S", "A":"S"},
	"20": {"2":"S", "3":"S", "4":"S", "5":"S", "6":"S", "7":"S", "8":"S", "9":"S", "T":"S", "J":"S", "Q":"S", "K":"S", "A":"S"},
	"19": {"2":"S", "3":"S", "4":"S", "5":"S", "6":"S", "7":"S", "8":"S", "9":"S", "T":"S", "J":"S", "Q":"S", "K":"S", "A":"S"},
	"18": {"2":"S", "3":"S", "4":"S", "5":"S", "6":"S", "7":"S", "8":"S", "9":"S", "T":"S", "J":"S", "Q":"S", "K":"S", "A":"S"},
	"17": {"2":"S", "3":"S", "4":"S", "5":"S", "6":"S", "7":"S", "8":"S", "9":"S", "T":"S", "J":"S", "Q":"S", "K":"S", "A":"S"},
	"16": {"2":"S", "3":"S", "4":"S", "5":"S", "6":"S", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"15": {"2":"S", "3":"S", "4":"S", "5":"S", "6":"S", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"14": {"2":"S", "3":"S", "4":"S", "5":"S", "6":"S", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"13": {"2":"S", "3":"S", "4":"S", "5":"S", "6":"S", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"12": {"2":"H", "3":"H", "4":"H", "5":"H", "6":"H", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"11": {"2":"D", "3":"D", "4":"D", "5":"D", "6":"D", "7":"D", "8":"D", "9":"D", "T":"D", "J":"D", "Q":"D", "K":"D", "A":"D"},
	"10": {"2":"D", "3":"D", "4":"D", "5":"D", "6":"D", "7":"D", "8":"D", "9":"D", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"9": {"2":"H", "3":"D", "4":"D", "5":"D", "6":"D", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"8": {"2":"H", "3":"H", "4":"H", "5":"H", "6":"H", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"7": {"2":"H", "3":"H", "4":"H", "5":"H", "6":"H", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"6": {"2":"H", "3":"H", "4":"H", "5":"H", "6":"H", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"5": {"2":"H", "3":"H", "4":"H", "5":"H", "6":"H", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"4": {"2":"H", "3":"H", "4":"H", "5":"H", "6":"H", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"}
		}
	};



const pairSplitTable =
	{
		"name": "pairsplit1",
		"schema": "INITIAL_PAIR",
	"type": "SPLIT",
		"rules": {
	"A,A": {"2":"Y", "3":"Y", "4":"Y", "5":"Y", "6":"Y", "7":"Y", "8":"Y", "9":"Y", "T":"Y", "J":"Y", "Q":"Y", "K":"Y", "A":"Y"},
	"K,K": {"2":"N", "3":"N", "4":"N", "5":"N", "6":"N", "7":"N", "8":"N", "9":"N", "T":"N", "J":"N", "Q":"N", "K":"N", "A":"N"},
	"Q,Q": {"2":"N", "3":"N", "4":"N", "5":"N", "6":"N", "7":"N", "8":"N", "9":"N", "T":"N", "J":"N", "Q":"N", "K":"N", "A":"N"},
	"J,J": {"2":"N", "3":"N", "4":"N", "5":"N", "6":"N", "7":"N", "8":"N", "9":"N", "T":"N", "J":"N", "Q":"N", "K":"N", "A":"N"},
	"T,T": {"2":"N", "3":"N", "4":"N", "5":"N", "6":"N", "7":"N", "8":"N", "9":"N", "T":"N", "J":"N", "Q":"N", "K":"N", "A":"N"},
	"9,9": {"2":"Y", "3":"Y", "4":"Y", "5":"Y", "6":"Y", "7":"N", "8":"Y", "9":"Y", "T":"N", "J":"N", "Q":"N", "K":"N", "A":"N"},
	"8,8": {"2":"Y", "3":"Y", "4":"Y", "5":"Y", "6":"Y", "7":"Y", "8":"Y", "9":"Y", "T":"Y", "J":"Y", "Q":"Y", "K":"Y", "A":"Y"},
	"7,7": {"2":"Y", "3":"Y", "4":"Y", "5":"Y", "6":"Y", "7":"Y", "8":"N", "9":"N", "T":"N", "J":"N", "Q":"N", "K":"N", "A":"N"},
	"6,6": {"2":"N", "3":"Y", "4":"Y", "5":"Y", "6":"Y", "7":"N", "8":"N", "9":"N", "T":"N", "J":"N", "Q":"N", "K":"N", "A":"N"},
	"5,5": {"2":"N", "3":"N", "4":"N", "5":"N", "6":"N", "7":"N", "8":"N", "9":"N", "T":"N", "J":"N", "Q":"N", "K":"N", "A":"N"},
	"4,4": {"2":"N", "3":"N", "4":"N", "5":"N", "6":"N", "7":"N", "8":"N", "9":"N", "T":"N", "J":"N", "Q":"N", "K":"N", "A":"N"},
	"3,3": {"2":"N", "3":"N", "4":"Y", "5":"Y", "6":"Y", "7":"Y", "8":"N", "9":"N", "T":"N", "J":"N", "Q":"N", "K":"N", "A":"N"},
	"2,2": {"2":"N", "3":"N", "4":"Y", "5":"Y", "6":"Y", "7":"Y", "8":"N", "9":"N", "T":"N", "J":"N", "Q":"N", "K":"N", "A":"N"}
		}
	};

const softTotalTable =
	{
		"name": "soft1",
		"schema": "INITIAL_PAIR",
	"type" : "SOFT",
	"rules": {
	"A,9": {"2":"S", "3":"S", "4":"S", "5":"S", "6":"S", "7":"S", "8":"S", "9":"S", "T":"S", "J":"S", "Q":"S", "K":"S", "A":"S"},
	"A,8": {"2":"S", "3":"S", "4":"S", "5":"S", "6":"S", "7":"S", "8":"S", "9":"S", "T":"S", "J":"S", "Q":"S", "K":"S", "A":"S"},
	"A,7": {"2":"S", "3":"S", "4":"S", "5":"S", "6":"S", "7":"S", "8":"S", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"A,6": {"2":"H", "3":"D", "4":"D", "5":"D", "6":"D", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"A,5": {"2":"H", "3":"H", "4":"D", "5":"D", "6":"D", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"A,4": {"2":"H", "3":"H", "4":"D", "5":"D", "6":"D", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"A,3": {"2":"H", "3":"H", "4":"H", "5":"D", "6":"D", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"A,2": {"2":"H", "3":"H", "4":"H", "5":"D", "6":"D", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"9,A": {"2":"S", "3":"S", "4":"S", "5":"S", "6":"S", "7":"S", "8":"S", "9":"S", "T":"S", "J":"S", "Q":"S", "K":"S", "A":"S"},
	"8,A": {"2":"S", "3":"S", "4":"S", "5":"S", "6":"S", "7":"S", "8":"S", "9":"S", "T":"S", "J":"S", "Q":"S", "K":"S", "A":"S"},
	"7,A": {"2":"S", "3":"S", "4":"S", "5":"S", "6":"S", "7":"S", "8":"S", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"6,A": {"2":"H", "3":"D", "4":"D", "5":"D", "6":"D", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"5,A": {"2":"H", "3":"H", "4":"D", "5":"D", "6":"D", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"4,A": {"2":"H", "3":"H", "4":"D", "5":"D", "6":"D", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"3,A": {"2":"H", "3":"H", "4":"H", "5":"D", "6":"D", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"},
	"2,A": {"2":"H", "3":"H", "4":"H", "5":"D", "6":"D", "7":"H", "8":"H", "9":"H", "T":"H", "J":"H", "Q":"H", "K":"H", "A":"H"}
	}
	};

function split(player, dealer, deck, splitTable, maxSplits) {
	current.hands

	let pair = pairSplitTable[`${hand[0][0]},${hand[1][0]}`];
	if (hand.length === 2 && pair && pair[dealerShow] === 'Y') {
		let newHand1 = [];
		let newHand2 = [];
		newHand1.push(hand[0]);
		newHand2.push(hand[1]);
		hand = [newHand1, newHand2];
	}
}

function evaluate(ruleSet, hand, dealerShow) {
	for (let i = 0; i < ruleSet.length; i++) {
		const set = ruleSet[i];

		switch (set.type) {
			case 'SOFT':
				let cards = set[`${hand[0][0]},${hand[1][0]}`];
				if (hand.length > 2 || !cards) {
					break;
				} else {
					return set[`${hand[0][0]},${hand[1][0]}`][dealerShow];
				}
			case 'HARD':
				let handVal = handValue(hand);

				return handVal <= 21 ? set[handVal][dealerShow] : 'S';
			default:
				return 'S';
		}
	}

	return 'S';
}

let cardCount = 0;

function play(playerCount, shoeSize, minBet, maxBet) {
	let dck = [];
	minBet = minBet ? minBet : 1;
	maxBet = maxBet ? maxBet : 100;

	let ruleSet = [softTotalTable, hardStratTable];

	const players = [];
	const busted = [];

	const dealer = {
		history: [],
		current: { hands: []}
	};

	let bet = 10;
	const payoutModifier = 6 / 5;
	const cashStart = 5000;

	for (let i = 0; i < playerCount; i++) {
		players.push(createPlayer(cashStart));
	}

	for (let i = 0; i < 1000; i++) {
		if (cardCount < 0) {
			bet = minBet;
		} else if (cardCount === 0){
			bet = Math.min(minBet * 2, maxBet);
		} else if (cardCount <= 5){
			bet = Math.min(minBet * 2, maxBet);
		} else if (cardCount <= 7) {
			bet = Math.min(minBet * 3, maxBet);
		} else if (cardCount <= 11) {
			bet = Math.min(minBet * 4, maxBet);
		} else if (cardCount <= 15) {
			bet = Math.min(minBet * 6, maxBet);
		} else {
			bet = Math.min(minBet * 8, maxBet);
		}

		// if (cardCount < 0) {
		// 	bet = minBet;
		// } else if (cardCount === 0){
		// 	bet = Math.min(minBet, maxBet);
		// } else {
		// 	bet = Math.min(minBet * 10, maxBet);
		// }


		if (players.length === 0) {
			break;
		}

		// Initial deal
		for (let r = 0; r < 2; r++) {
			players.forEach((player) => {
				giveCard(player, dck, shoeSize);
			});

			giveCard(dealer, dck, shoeSize);
		}

		let dealerShow = dealer.current.hands[0][1][0];

		// Calc
		players.forEach((player) => {
			split(player.current, dealerShow);


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
					default:
						break;
				}

			} while (eval === 'H');
		});

		while (handValue(dealer.current) <= 17) {
			giveCard(dealer, dck, shoeSize);
		}

		let dealerVal = handValue(dealer.current);

		players.forEach((player) => {
			let val = handValue(player.current);
			let res = 'P';
			let amount = 0;

			if (val === 21 && player.current.length === 2) {
				amount = (bet * payoutModifier);
				res = 'W';
			} else if (val > 21 || (val < dealerVal && dealerVal <= 21)) {
				amount = -bet;
				res = 'L';
			} else if (val > dealerVal || dealerVal > 21) {
				amount = bet;
				res = 'W';
			}

			switch (res) {
				case 'W':
					player.stats.TotalWinDollar += amount;
					player.stats.Wins++;
					if (amount > player.stats.LargestWin) {
						player.stats.LargestWin = amount;
					}
					break;
				case 'L':
					player.stats.TotalLossDollar += amount;
					player.stats.Losses++;
					if (amount < player.stats.LargestLoss) {
						player.stats.LargestLoss = amount;
					}
					break;
				default:
					player.stats.Pushes++;
					break;
			}

			player.cash += amount;

			if (player.cash > player.stats.HighestCash) {
				player.stats.HighestCash = player.cash;
			}

			if (player.cash < player.stats.LowestCash) {
				player.stats.LowestCash = player.cash;
			}

			player.history.push({
				cards: player.current,
				result: res,
				amount: amount
			});
			player.current = [];
		});

		dealer.history.push(dealer.current);
		dealer.current = [];

		let bustedIndices = [];
		players.forEach((player, idx) => {
			if (player.cash <= 0) {
				bustedIndices.push(idx);
			}
		});

		bustedIndices.forEach(idx => {
			busted.push(players.splice(idx, 1)[0]);
		});

	}



	busted.forEach(player => {
		console.log(`Busted: ${player.cash} Starting: ${player.stats.CashStart} Win $: ${player.stats.TotalWinDollar} Loss $: ${player.stats.TotalLossDollar} Earning: ${player.cash - player.stats.CashStart} Turns: ${player.history.length} Wins: ${player.stats.Wins} Losses: ${player.stats.Losses} Push: ${player.stats.Pushes} Win %: ${(player.stats.Wins/(player.history.length - player.stats.Pushes) * 100).toFixed(2)} Loss %: ${(player.stats.Losses/(player.history.length - player.stats.Pushes) * 100).toFixed(2)} Highest: ${player.stats.HighestCash} Lowest: ${player.stats.LowestCash} Largest Win: ${player.stats.LargestWin} Largest Loss: ${player.stats.LargestLoss}`);
	});

	players.forEach(player => {
		console.log(`Final Cash: ${player.cash} Starting: ${player.stats.CashStart} Win $: ${player.stats.TotalWinDollar} Loss $: ${player.stats.TotalLossDollar} Earning: ${player.cash - player.stats.CashStart} Turns: ${player.history.length} Wins: ${player.stats.Wins} Losses: ${player.stats.Losses} Push: ${player.stats.Pushes} Win %: ${(player.stats.Wins/(player.history.length - player.stats.Pushes) * 100).toFixed(2)} Loss %: ${(player.stats.Losses/(player.history.length - player.stats.Pushes) * 100).toFixed(2)} Highest: ${player.stats.HighestCash} Lowest: ${player.stats.LowestCash} Largest Win: ${player.stats.LargestWin} Largest Loss: ${player.stats.LargestLoss}`);
	});


}

function tryParseJSON(jsonString) {
	try {
		var o = JSON.parse(jsonString);

		// Handle non-exception-throwing cases:
		// Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
		// but... JSON.parse(null) returns null, and typeof null === "object",
		// so we must check for that, too. Thankfully, null is falsey, so this suffices:
		if (o && typeof o === "object") {
			return o;
		}
	} catch (e) {}

	return false;
};

function createTable(orig) {
	let result = {};

	if (!orig || !orig.name || !orig.schema || !orig.type || !orig.table) {
		throw "Invalid format for conversion";
	} else {
		result.name = orig.name;
		result.schema = orig.schema;
		result.type = orig.type;

		let split = orig.table.split('\n');
		let columnHeader = split[0].split(',');

		if (columnHeader[0] !== '') {
			throw "Invalid format for conversion"
		}

		let rowHeader = [];

		result.rules = {};

		for (let i = 1; i < split.length; i++) {
			const row = split[i];
			let rowSplit = row.split(',')
			result.rules[rowSplit[0]] = {};

			for (let j = 1; j < rowSplit.length; j++) {
				const item = rowSplit[j];
				result.rules[rowSplit[0]][columnHeader[j]] = item;
			}
		}
	}

	return result;
}

module.exports.createDeck = createDeck;
module.exports.durstenfeld = durstenfeld;
module.exports.createRandomDeck = createRandomDeck;
module.exports.giveCard = giveCard;
module.exports.createPlayer = createPlayer;
module.exports.createGame = createGame;
module.exports.initialDeal = initialDeal;
module.exports.handValue = handValue;
module.exports.tryParseJSON = tryParseJSON;
module.exports.createTable = createTable;
module.exports.split = split;
