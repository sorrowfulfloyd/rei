require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
require('express-async-errors')
const { validateToken } = require('../auth/jwt')

const deviceRoute = require('../routes/devices')
const authRoute = require('../routes/auth.js')
const errorHandler = require('../middleware/errorHandler.js')
const notFound = require('../middleware/notFound.js')


app.use(express.json());
app.use(cors());

app.use('/auth', authRoute);
app.use('/devices', deviceRoute);
app.use(errorHandler);
app.use(notFound);

// Get server and database status
app.use('/uptime', async (req, res) => {
  const date = new Date();
  const health = {
    "Server Status": 'OK',
    "MongoDB Status": (await mongoDB).STATES[(await mongoDB).connection.readyState],
    "uptime (in seconds)": Math.floor(process.uptime()),
    timestamp: date.toLocaleString('tr-TR'),
  }
  try {
    res.status(200).json({ message: health });
  } catch (error) {
    res.status(503).json({ message: error.message });
  }
})

function auth(req, res, next) {
  if (!validateToken(req.header('token'))) { return res.status(401).json(unauthorizedAttempt) }  // TODO: don't forget to change this to get cookies from browser
  next();
};

module.exports = app
