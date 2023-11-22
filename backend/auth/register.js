/*
[TODO]
- Get the user data
- Search the database for if the user already exists.
- If not, hash the password and add it to the users database.
- Answer accordingly to POSTer.

[FUTURE]
- After a successful signup redirect the user to login page.
*/

const { Users } = require('../db/models')
const { hashPassword, compareHashes } = require('../crypt/crypt')
const express = require('express')

const router = express.Router();
router.use(express.json());

router.post('/', async (req, res) => {
  // TODO
});


module.exports = router;