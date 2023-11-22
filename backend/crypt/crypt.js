const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

/**
 * Hashes a password using bcrypt.
 *
 * @param {string} str - The password to be hashed.
 * @return {Promise<string>} The hashed password.
 */

const hashPassword = async (str) => {
  try {
    const hash = await bcrypt.hash(str, SALT_ROUNDS);
    return hash;
  } catch (error) {
    console.log('ERROR while hashing a password -> ', error)
    return error.message;
  }
}

/**
 * Compares a string with a hash using bcrypt.
 *
 * @param {string} str - The string to compare with the hash.
 * @param {string} hash - The hash to compare with the string.
 * @return {Promise<boolean | string>} - A promise that resolves to a boolean indicating whether the string matches the hash, or an error message if an error occurred.
 */

const compareHashes = async (str, hash) => {
  try {
    const comparison = await bcrypt.compare(str, hash);
    return comparison;
  } catch (error) {
    console.log('ERROR while comparing a password -> ', error)
    return error.message;
  }
}

module.exports = { hashPassword, compareHashes };