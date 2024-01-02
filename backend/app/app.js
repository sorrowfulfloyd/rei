require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const authRegisterRouter = require('../auth/register')
const authLoginRouter = require('../auth/login')
const authToken = require('../auth/auth')
const { validateToken } = require('../auth/jwt')

const DB_ADRESS = process.env.DB_ADDRESS
const PORT = process.env.PORT || 3000;

const { Device } = require('../db/models')

app.use('/auth/register', authRegisterRouter);
app.use('/auth/login', authLoginRouter);
app.use('/auth/token', authToken);

app.use(express.json());
app.use(cors());

// How can I make all the requests use cors by default?


// Default empty GET request
app.get('/', async (req, res) => {
  try {
    console.log('GET request successful.')
    return res.status(200).json({ message: 'Default GET request succesful' });
  } catch (error) {
    console.log(`[ERR] Default GET request has failed!  - ${error}`)
    return res.status(500).json({ err: error, fromWhere: "Default GET message" })
  }
});

// Get ALL devices from db, or lookup a single one if an id is given in the request parameters.
app.get('/devices', async (req, res) => {
  try {
    const id = req.header('id');
    let devices = {}, device;

    if (id) { // if an ID is given with the params, lookup for it only, else return all the devices.
      if (!(mongoose.Types.ObjectId.isValid(id))) {
        return res.status(400).json({ message: `ID you've given is not valid!` });
      }

      device = await Device.findByIdAndUpdate(id);
      return device !== null
        ? res.status(200).json({ message: device })
        : res.status(404).json({
          message: `Couldn't find any object with given data`
        });
    }
    // TODO: SORT DIFFERENT DEVICE TYPES, THEN SEND THEM.

    if ((await Device.find()).length > 0) {
      devices = {
        ...devices,
        ...{ devices: await Device.find() }
      }
      return res.status(200).json(devices);
    } else {
      return res.status(404).json({ message: "Database is empty" });
    }

  }
  catch (error) {
    console.log(`[ERR] failed to fetch devices - ${error}`)
    return res.status(500).json({ message: error.message, });
  }
})

// Add a device to db
app.post('/devices', async (req, res) => {
  try {
    let device;
    let insertDevice;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body is empty" })
    }

    device = new Device({ ...req.body });
    insertDevice = await device.save();
    console.log('SUCCESSFULLY INSERTED A DEVICE')
    return res.status(200).json({
      message: "Successfully inserted the device",
      object: insertDevice,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Delete a device from db
app.delete('/devices', async (req, res) => {
  try {
    const id = req.query.id;
    let deviceToBeDeleted;

    if ((!mongoose.Types.ObjectId.isValid(id) || !(id))) {
      return res.status(400).json({ message: `ID you've given is not valid!`, });
    }

    deviceToBeDeleted = await Device.findByIdAndDelete(id);

    return deviceToBeDeleted !== null ? res.status(200).json({
      message: `Device is successfully deleted`,
      object: { deviceToBeDeleted }
    }) : res.status(404).json({ message: `Couldn't find any object with given data` });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

// Get server and database status
app.use('/uptime', async (req, res) => {
  let date = new Date();
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
  else {
    next();
  }
};

// Default message for invalid requests
const unauthorizedAttempt = {
  Status: "401 - Unauthorized",
  message: "Bad or invalid token. Make sure you're logged in before trying again. If this problem persists clear your cookies and try again"
}


const connectToDB = async () => {
  const mongoDB = mongoose.connect(DB_ADRESS);
  let retryCountToDatabase = 0;
  try {
    while (true) {
      let mongo = await mongoDB;

      if (mongo.connection.readyState === 1) {
        return mongo;
      } else {
        if (retryCountToDatabase >= 10) {
          console.log('Too many tries, quitting... Check if everything is in order and try again.\n');
          process.abort();
        }
        retryCountToDatabase++;
        await new Promise(resolve => setTimeout(resolve, 2000)); // wait a little
        console.log(`[ERROR] Connection to MongoDB cluster is failed. Retrying in a second... ${retryCountToDatabase} of 10`);
        continue;
      }
    }
  } catch (error) {
    console.log(`[ERROR] - Couldn't even start the connection to  MongoDB cluster!\n- ${error.message}`)
  }
};

module.exports = { PORT, connectToDB, app }
