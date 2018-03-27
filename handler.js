'use strict';

const card = require('app.js');

module.exports.ping = (event, context, callback) => {
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
			message: 'Ping Successful',
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
