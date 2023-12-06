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

const cors = require('cors');
const { compareHashes } = require('../crypt/crypt');
const findBy = require('./findBy');
const { createToken } = require('./jwt')

const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(cors({
  origin: 'http://127.0.0.1:5500',
  optionsSuccessStatus: 200
}));

router.post('/', cors(), async (req, res) => {
  // TODO
  try {
    console.log('Recieved a login request!')
    let user = await findBy.Username(req.body.username, true)
    if (!user) {
      console.log(`[DEBUG (login.js)] - Someone tried to sign-in with an unknown username. Redirect them to register page! Username: ${req.body.username}`)
      res.status(404).json({ message: "Invalid credentials, please sign-up first." })
    } else {
      // const isSigned = await Users.findOne({ username: req.body.username })
      // if (isSigned.signedIn) {
      //   console.log(`[DEBUG (login.js)] - A user that's already marked as signed-in in the database is trying to sign-in again. Blocking... Username: '${req.body.username}'`);
      //   return res.status(400).json({ status: 400, msg: `User: ${req.body.username} is already signed in!` })
      // }
      console.log('[DEBUG (login.js)] - Username is right, proceeding..')
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
          // await Users.findOneAndUpdate({ username: req.body.username }, { signedIn: true })
          const token = createToken(req.body.username);
          console.log('[DEBUG (login.js)] - Password is also right and checks OK with the hash in the DB, RETURNING TOKEN -->\n', token)
          return res.status(200).json({ token: token });
        default:
          console.log('[DEBUG (login.js)] - Hash comparison is failed, password given is wrong');
          return res.status(404).json({ message: "Wrong password" });
      }
    }
  } catch (error) {
    return res.status(400).json({ message: "Couldn't login the user!", error: error.message });
  }
})

module.exports = router;