/*
[TODO]
- Get the user data
- Search the database for if the user already exists.
- If yes, compare the user's password to the hash we have. 
- Answer accordingly to POSTer.

[FUTURE]
- After a successful login redirect the user to dashboard page AND don't let it go to register/login page after they're logged in.
*/

const { Users } = require('../db/models')
const { hashPassword, compareHashes } = require('../crypt/crypt')
const express = require('express')

const router = express.Router();
router.use(express.json());

router.post('/', async (res, req) => {
  // TODO
})


module.exports = router;