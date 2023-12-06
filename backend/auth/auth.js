// check a token

const express = require('express')
const cors = require('cors')

const { validateToken } = require('./jwt');
const router = express.Router();

router.use(express.json());
router.use(cors({
  origin: 'http://127.0.0.1:5500',
  optionsSuccessStatus: 200
}));

router.post('/', cors(), async (req, res) => {
  try {
    if (!validateToken(req.body.token)) {
      throw new Error('');
    }
    return res.status(200).json({ message: "Token is validated" })
  } catch (error) {
    return res.status(400).json({ message: "Couldn't validate the token" })
  }
});

module.exports = router;