const { Users } = require('../db/models')

const findBy = {

  /**
 * Checks if the given email exists in the Users collection.
 *
 * @param {string} mail - The email to check.
 * @return {boolean} Returns true if the email exists, false otherwise.
 */

  Email: async (mail) => {
    try {
      const data = (await Users.find({ email: mail })).length > 0 ? true : false;
      return data;
    } catch (error) {
      console.log(`ERROR in findBy() namespace, couldn't run the Email function\n${error.message}`)
      return false;
    }
  },

  /**
 * A function that takes a username and optional parameters for login, and returns a boolean or hashed password.
 *
 * @param {string} user - The username to search for.
 * @param {...any} forLogin - Optional parameters for login.
 * @return {boolean|string} - Returns a boolean if no login parameters are provided, or the hashed password if login parameters are provided.
 */

  Username: async (user, ...forLogin) => {
    try {
      let userInDB = await Users.findOne({ username: user }) || '';

      let data = (userInDB.username) ? true : false;

      if (data && forLogin) {
        data = userInDB.password;
      }

      return data;
    } catch (error) {
      console.log(`ERROR in findBy() namespace, couldn't run the Username function\n${error.message}`)
      return false;
    }
  }
};

module.exports = findBy