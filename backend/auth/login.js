/*
[TODO]
- Get the user data
- Search the database for if the user already exists.
- If yes, compare the user's password to the hash we have. 
- Send the user a Session Token.
- Answer accordingly to POSTer.

[FUTURE]
- Don't let the user go back register/login page while they're logged in.
*/

const { Users } = require('../db/models');
const { compareHashes } = require('../crypt/crypt');
const findBy = require('./findBy');

const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

const createToken = (username) => {
  const token = jwt.sign({ for: username }, process.env.TOKEN_KEY)
  return token;
}

router.use(express.json());

router.post('/', async (req, res) => {
  // TODO
  try {
    let user = await findBy.Username(req.body.username, true)
    if (!user) {
      console.log('USER NOT FOUND')
      res.status(404).send("User not found")
    } else {
      console.log('USER FOUND!')
      let result = await compareHashes(req.body.password, user)
      switch (result) {
        case true:
          /*
            Here means the user is successfully logged in!
            - Right now, we return a new token at every request, there should be a system to avoid doing that, like marking the user as logged in.
            (Maybe in the Database)
            - If the user is already logged in return no no.
            - If the user is already logged in, maybe don't let them back to this page lol. (So better check if they're logged in at the beginning)
          */
          const token = createToken(req.body.username)
          console.log('PASSWORD IS RIGHT, RETURNING TOKEN\n', token)
          return res.status(200).json({ token: token })
        default:
          console.log('PASSWORD IS WRONG')
          return res.status(404).json({ message: "Wrong password" })
      }
    }
  } catch (error) {
    return res.status(400).json({ message: "Couldn't login the user!", error: error.message });
  }
})

module.exports = router;