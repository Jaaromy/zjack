'use strict';

const card = require('app.js');

module.exports.test = (event, context, callback) => {
	let sourceIp = null;
	let sourceUserAgent = null;

	if (event && event.requestContext && event.requestContext.identity) {
		sourceIp = event.requestContext.identity.sourceIp;
		sourceUserAgent = event.requestContext.identity.userAgent;
	}

	const response = {
		statusCode: 200,
		headers: {
			'Access-Control-Allow-Origin': '*', // Required for CORS support to work
		},
		body: JSON.stringify({
			message: 'Test Successful',
			sourceIp: sourceIp,
			sourceUserAgent: sourceUserAgent,
			deck: card.createDeck(),
			rando: card.createRandomDeck()
		})
	};

	callback(null, response);
};

module.exports.randomDeck = (event, context, callback) => {
	let sourceIp = null;
	let sourceUserAgent = null;

	if (event && event.requestContext && event.requestContext.identity) {
		sourceIp = event.requestContext.identity.sourceIp;
		sourceUserAgent = event.requestContext.identity.userAgent;
	}

	const response = {
		statusCode: 200,
		headers: {
			'Access-Control-Allow-Origin': '*', // Required for CORS support to work
		},
		body: JSON.stringify({
			message: 'Randomized Deck',
			deck: card.createRandomDeck()
		})
	};

	callback(null, response);
};


module.exports.createRuleTable = (event, context, callback) => {
	try {
		let orig = card.tryParseJSON(event.body);
		let result = card.createTable(orig);
		const response = {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*', // Required for CORS support to work
			},
			body: JSON.stringify(result)
		};

		callback(null, response);
	} catch (error) {
		callback(null, {
			statusCode: 500,
			message: error
		})
	}
};
