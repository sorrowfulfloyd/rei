require('dotenv').config();
const jwt = require('jsonwebtoken');
const KEY = process.env.TOKEN_KEY;

/**
 * Creates a token for the given username.
 *
 * @param {string} username - The username for which the token is being created.
 * @return {string} The created token.
 */

const createToken = (username) => { // RETARDS THAT MADE THE JWT LIB FOR NODE.JS DIDN'T ACTUALLY MADE IT ASYNC LOL. WAIT, MAYBE IT DOESN'T NEED TO BE?
  try {
    return jwt.sign({ for: username }, KEY);
  } catch (error) {
    throw error;
  }
};

/**
 * Validates a token.
 *
 * @param {string} token - The token to be validated.
 * @return {boolean} Returns true if the token is valid, false otherwise.
 */

const validateToken = (token) => {
  const result = jwt.verify(token, KEY, (error, token) => {
    return token ? true : false;
  })
  return result;
};

module.exports = { createToken, validateToken }