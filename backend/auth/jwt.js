require("dotenv").config();
const jwt = require("jsonwebtoken");
const KEY = process.env.TOKEN_KEY;

/**
 * Creates a token for the given username.
 *
 * @param {string} username - The username for which the token is being created.
 * @return {string} The created token.
 */

const createToken = (username) => {
	return username ? jwt.sign({ for: username }, KEY) : null;
};

/**
 * Validates a token.
 *
 * @param {string} token - The token to be validated.
 * @return {boolean} Returns true if the token is valid, false otherwise.
 */

const validateToken = (token) => {
	const result = jwt.verify(token, KEY, (error, token) => {
		if (error) return null;
		return token ? true : false;
	});
	return result;
};

module.exports = { createToken, validateToken };
