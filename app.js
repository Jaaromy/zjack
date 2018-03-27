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

function createPlayer(startingCash) {
	let pl = {};
	pl.cash = startingCash;
	pl.current = [];
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

function giveCard(person, deck, shoeSize) {
	if (!deck || deck.length === 0) {
		deck.push(...createRandomDeck(shoeSize));
	}

	let card = deck.pop();
	let redSev = redSevenCount(card);

	cardCount += redSev;

	person.current.push(card);
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
	type: 'HARD',
	'21': {'2':'S', '3':'S', '4':'S', '5':'S', '6':'S', '7':'S', '8':'S', '9':'S', 'T':'S', 'J':'S', 'Q':'S', 'K':'S', 'A':'S'},
	'20': {'2':'S', '3':'S', '4':'S', '5':'S', '6':'S', '7':'S', '8':'S', '9':'S', 'T':'S', 'J':'S', 'Q':'S', 'K':'S', 'A':'S'},
	'19': {'2':'S', '3':'S', '4':'S', '5':'S', '6':'S', '7':'S', '8':'S', '9':'S', 'T':'S', 'J':'S', 'Q':'S', 'K':'S', 'A':'S'},
	'18': {'2':'S', '3':'S', '4':'S', '5':'S', '6':'S', '7':'S', '8':'S', '9':'S', 'T':'S', 'J':'S', 'Q':'S', 'K':'S', 'A':'S'},
	'17': {'2':'S', '3':'S', '4':'S', '5':'S', '6':'S', '7':'S', '8':'S', '9':'S', 'T':'S', 'J':'S', 'Q':'S', 'K':'S', 'A':'S'},
	'16': {'2':'S', '3':'S', '4':'S', '5':'S', '6':'S', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'15': {'2':'S', '3':'S', '4':'S', '5':'S', '6':'S', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'14': {'2':'S', '3':'S', '4':'S', '5':'S', '6':'S', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'13': {'2':'S', '3':'S', '4':'S', '5':'S', '6':'S', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'12': {'2':'H', '3':'H', '4':'H', '5':'H', '6':'H', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'11': {'2':'D', '3':'D', '4':'D', '5':'D', '6':'D', '7':'D', '8':'D', '9':'D', 'T':'D', 'J':'D', 'Q':'D', 'K':'D', 'A':'D'},
	'10': {'2':'D', '3':'D', '4':'D', '5':'D', '6':'D', '7':'D', '8':'D', '9':'D', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'9': {'2':'H', '3':'D', '4':'D', '5':'D', '6':'D', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'8': {'2':'H', '3':'H', '4':'H', '5':'H', '6':'H', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'7': {'2':'H', '3':'H', '4':'H', '5':'H', '6':'H', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'6': {'2':'H', '3':'H', '4':'H', '5':'H', '6':'H', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'5': {'2':'H', '3':'H', '4':'H', '5':'H', '6':'H', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'4': {'2':'H', '3':'H', '4':'H', '5':'H', '6':'H', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'}
	};

const pairSplitTable =
	{
	type: 'SPLIT',
	'A,A': {'2':'Y', '3':'Y', '4':'Y', '5':'Y', '6':'Y', '7':'Y', '8':'Y', '9':'Y', 'T':'Y', 'J':'Y', 'Q':'Y', 'K':'Y', 'A':'Y'},
	'K,K': {'2':'N', '3':'N', '4':'N', '5':'N', '6':'N', '7':'N', '8':'N', '9':'N', 'T':'N', 'J':'N', 'Q':'N', 'K':'N', 'A':'N'},
	'Q,Q': {'2':'N', '3':'N', '4':'N', '5':'N', '6':'N', '7':'N', '8':'N', '9':'N', 'T':'N', 'J':'N', 'Q':'N', 'K':'N', 'A':'N'},
	'J,J': {'2':'N', '3':'N', '4':'N', '5':'N', '6':'N', '7':'N', '8':'N', '9':'N', 'T':'N', 'J':'N', 'Q':'N', 'K':'N', 'A':'N'},
	'T,T': {'2':'N', '3':'N', '4':'N', '5':'N', '6':'N', '7':'N', '8':'N', '9':'N', 'T':'N', 'J':'N', 'Q':'N', 'K':'N', 'A':'N'},
	'9,9': {'2':'Y', '3':'Y', '4':'Y', '5':'Y', '6':'Y', '7':'N', '8':'Y', '9':'Y', 'T':'N', 'J':'N', 'Q':'N', 'K':'N', 'A':'N'},
	'8,8': {'2':'Y', '3':'Y', '4':'Y', '5':'Y', '6':'Y', '7':'Y', '8':'Y', '9':'Y', 'T':'Y', 'J':'Y', 'Q':'Y', 'K':'Y', 'A':'Y'},
	'7,7': {'2':'Y', '3':'Y', '4':'Y', '5':'Y', '6':'Y', '7':'Y', '8':'N', '9':'N', 'T':'N', 'J':'N', 'Q':'N', 'K':'N', 'A':'N'},
	'6,6': {'2':'N', '3':'Y', '4':'Y', '5':'Y', '6':'Y', '7':'N', '8':'N', '9':'N', 'T':'N', 'J':'N', 'Q':'N', 'K':'N', 'A':'N'},
	'5,5': {'2':'N', '3':'N', '4':'N', '5':'N', '6':'N', '7':'N', '8':'N', '9':'N', 'T':'N', 'J':'N', 'Q':'N', 'K':'N', 'A':'N'},
	'4,4': {'2':'N', '3':'N', '4':'N', '5':'N', '6':'N', '7':'N', '8':'N', '9':'N', 'T':'N', 'J':'N', 'Q':'N', 'K':'N', 'A':'N'},
	'3,3': {'2':'N', '3':'N', '4':'Y', '5':'Y', '6':'Y', '7':'Y', '8':'N', '9':'N', 'T':'N', 'J':'N', 'Q':'N', 'K':'N', 'A':'N'},
	'2,2': {'2':'N', '3':'N', '4':'Y', '5':'Y', '6':'Y', '7':'Y', '8':'N', '9':'N', 'T':'N', 'J':'N', 'Q':'N', 'K':'N', 'A':'N'}
	};

const softTotalTable =
	{
	type : 'SOFT',
	'A,9': {'2':'S', '3':'S', '4':'S', '5':'S', '6':'S', '7':'S', '8':'S', '9':'S', 'T':'S', 'J':'S', 'Q':'S', 'K':'S', 'A':'S'},
	'A,8': {'2':'S', '3':'S', '4':'S', '5':'S', '6':'S', '7':'S', '8':'S', '9':'S', 'T':'S', 'J':'S', 'Q':'S', 'K':'S', 'A':'S'},
	'A,7': {'2':'S', '3':'S', '4':'S', '5':'S', '6':'S', '7':'S', '8':'S', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'A,6': {'2':'H', '3':'D', '4':'D', '5':'D', '6':'D', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'A,5': {'2':'H', '3':'H', '4':'D', '5':'D', '6':'D', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'A,4': {'2':'H', '3':'H', '4':'D', '5':'D', '6':'D', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'A,3': {'2':'H', '3':'H', '4':'H', '5':'D', '6':'D', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'A,2': {'2':'H', '3':'H', '4':'H', '5':'D', '6':'D', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'9,A': {'2':'S', '3':'S', '4':'S', '5':'S', '6':'S', '7':'S', '8':'S', '9':'S', 'T':'S', 'J':'S', 'Q':'S', 'K':'S', 'A':'S'},
	'8,A': {'2':'S', '3':'S', '4':'S', '5':'S', '6':'S', '7':'S', '8':'S', '9':'S', 'T':'S', 'J':'S', 'Q':'S', 'K':'S', 'A':'S'},
	'7,A': {'2':'S', '3':'S', '4':'S', '5':'S', '6':'S', '7':'S', '8':'S', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'6,A': {'2':'H', '3':'D', '4':'D', '5':'D', '6':'D', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'5,A': {'2':'H', '3':'H', '4':'D', '5':'D', '6':'D', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'4,A': {'2':'H', '3':'H', '4':'D', '5':'D', '6':'D', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'3,A': {'2':'H', '3':'H', '4':'H', '5':'D', '6':'D', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'},
	'2,A': {'2':'H', '3':'H', '4':'H', '5':'D', '6':'D', '7':'H', '8':'H', '9':'H', 'T':'H', 'J':'H', 'Q':'H', 'K':'H', 'A':'H'}
	};

function split(hand, dealerShow) {
	let cards = `${hand[0][0]},${hand[1][0]}`;

	return pairSplitTable[cards] && pairSplitTable[cards][dealerShow] === 'Y';
}

function stay(ruleSet, hand, dealerShow) {
	for (let i = 0; i < ruleSet.length; i++) {
		const set = ruleSet[i];

		switch (set.type) {
			case 'SOFT':
				let cards = set[`${hand[0][0]},${hand[1][0]}`];
				if (hand.length > 2 || !cards) {
					break;
				} else {
					return set[`${hand[0][0]},${hand[1][0]}`][dealerShow] === 'S';
				}
			case 'HARD':
				let handVal = handValue(hand);

				return handVal <= 21 && set[handVal][dealerShow] !== 'S' ? false : true;
			default:
				return true;
		}
	}
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
		current: []
	};

	let bet = 10;
	const payoutModifier = 3 / 2;

	for (let i = 0; i < playerCount; i++) {
		players.push(createPlayer(100));
	}



	for (let i = 0; i < 10000; i++) {
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

		let dealerShow = dealer.current[1][0];

		// Calc
		players.forEach((player) => {
			while (!stay(ruleSet, player.current, dealerShow)) {
				giveCard(player, dck, shoeSize);
			}
		});

		while (handValue(dealer.current) <= 17) {
			giveCard(dealer, dck, shoeSize);
		}

		let dealerVal = handValue(dealer.current);

		players.forEach((player) => {
			let val = handValue(player.current);
			let res = 'P';

			if (val === 21 && player.current.length === 2) {
				player.cash += (bet * payoutModifier);
				res = 'W';
			} else if (val > 21 || (val < dealerVal && dealerVal <= 21)) {
				player.cash -= bet;
				res = 'L';
			} else if (val > dealerVal || dealerVal > 21) {
				player.cash += bet;
				res = 'W';
			}

			player.history.push({
				cards: player.current,
				result: res
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
		console.log(`Busted: ${player.cash} - ${player.history.length} turns`);
	});

	players.forEach(player => {
		console.log(player.cash);
	});


}

play(4, 6, 2, 200);

// console.log(createDeck().join(' '));
// console.log(createRandomDeck().join(' '));

module.exports.createDeck = createDeck;
module.exports.durstenfeld = durstenfeld;
module.exports.createRandomDeck = createRandomDeck;
