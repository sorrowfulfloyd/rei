/*
[TODO]
- [x] Get the user data
- [x] Search the database for if the user already exists.
- [x] If not, hash the password and add it to the users database.
- [x] Answer accordingly to POSTer.

[FUTURE]
- After a successful signup redirect the user to login page.

[DON'T FORGET]
- Validate the email, make sure the password is strong in the FRONTEND!
*/

const { Users } = require('../db/models')
const { hashPassword } = require('../crypt/crypt')
const findBy = require('./findBy')

const cors = require('cors');
const express = require('express');

const router = express.Router();

router.use(express.json());
router.use(cors({
  origin: 'http://127.0.0.1:5500',
  optionsSuccessStatus: 200
}));

router.post('/', cors(), async (req, res) => {
  try {
    if (await findBy.Email(req.body.email)) {
      console.log(`[DEBUG (register.js)] - ${req.body.email} is already taken!`)
      return res.status(400).json({ message: "[ERROR] An user with provided email is already registered!", email: req.body.email });
    } else {
      if (await findBy.Username(req.body.username)) {
        console.log(`[DEBUG (register.js)] - ${req.body.username} is already taken!`)
        return res.status(400).json({ message: "[ERROR] An user with provided username is already registered!", username: req.body.username });
      } else {
        console.log(`[DEBUG (register.js)] - Registering the user...`)
        const userInfo = new Users({
          username: req.body.username,
          email: req.body.email,
          password: await hashPassword(req.body.password)
        });
        await userInfo.save();
        console.log(`[DEBUG (register.js)] - User has been saved successfully. Email: '${userInfo.email}', username: '${userInfo.username}'`)
        return res.status(200).json({ message: "User has been registered successfully.", userInfo: [userInfo.username, userInfo.email] });
      }
    }
  } catch (error) {
    return res.status(400).json({ message: "Couldn't register the user!", error: error.message });
  }
});



module.exports = router;