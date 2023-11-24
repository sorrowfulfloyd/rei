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

const { Users } = require('../db/models')
const { compareHashes } = require('../crypt/crypt')
const express = require('express')
const findBy = require('./findBy')

const router = express.Router();
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
          console.log('PASSWORD IS RIGHT')
          return res.status(200).json({ message: "Password is right" })
        /*
          Here means the user is successfully logged in!
        */
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