require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const authRegisterRouter = require('./auth/register')
const authLoginRouter = require('./auth/login')


const DB_ADRESS = process.env.DB_ADDRESS
const PORT = process.env.PORT || 3000;
let retryCountToDatabase = 0;

const { Device } = require('./models')
const mongoDB = mongoose.connect(DB_ADRESS);

app.use('/auth/register', authRegisterRouter);


app.use(express.json());


// Default empty GET request
app.get('/', async (req, res) => {
  try {
    console.log('GET request successful.')
    return res.send('Default GET request');
  } catch (error) {
    console.log(`[ERR] Default GET request has failed! WOW - ${error}`)
    return res.status(500).json({
      Status: 500,
      Message: error.message,
      Message: 'Default GET request has been failed by us'
    })
  }
});

// Get ALL devices from db, or lookup a single one if an id is given in the request parameters.
app.get('/devices', async (req, res) => {
  try {
    const id = req.query.id;
    let devices = {}, device;

    if (id) { // if an ID is given with the params, lookup for it only, else return all the devices.
      if (!(mongoose.Types.ObjectId.isValid(id))) {
        return res.status(400).json({
          Status: 400,
          Code: "Bad request",
          Message: `ID you've given is not valid!`,
          id: id,
          Parameter_List: req.query,
        });
      }

      device = await Device.findByIdAndUpdate(id);
      return device !== null
        ? res.status(200).json({ device })
        : res.status(404).json({
          Status: 404,
          Message: `Couldn't find any object with given data`,
          id: id ? id : "undefined"
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
      return res.status(404).json({ devices: "Database is empty" });
    }

  }
  catch (error) {
    console.log(`[ERR] failed to fetch devices - ${error}`)
    return res.status(500).json({
      Status: 500,
      Server_Error_Message: error.message,
    });
  }
})

// Add a device to db
app.post('/devices', async (req, res) => {
  try {
    let device;
    let insertDevice;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        Status: 400,
        Code: "Bad request",
        Message: "Request body is empty"
      })
    }

    device = new Device({ ...req.body });
    insertDevice = await device.save();

    return res.status(200).json({
      Message: "Success",
      "Inserted device:": insertDevice,
    });

  } catch (error) {
    return res.status(500).json({
      Status: 500,
      Server_Error_Message: error.message,
    });
  }
});

// Delete a device from db
app.delete('/devices', async (req, res) => {
  try {
    const id = req.query.id;
    let deviceToBeDeleted;

    if ((!mongoose.Types.ObjectId.isValid(id) || !(id))) {
      return res.status(400).json({
        Status: 400,
        Code: "Bad request",
        Message: `ID you've given is not valid!`,
        id: id ? id : "undefined",
        Parameter_List: req.query,
      });
    }

    deviceToBeDeleted = await Device.findByIdAndDelete(id);

    return deviceToBeDeleted !== null ? res.status(200).json({
      status: `Object is successfully deleted`,
      object: { deviceToBeDeleted }
    }) : res.status(404).json({
      Status: 404,
      Message: `Couldn't find any object with given data`,
      id: id ? id : "undefined"
    });

  } catch (error) {
    return res.status(500).json({
      Status: 500,
      Message: error.message
    });
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
    res.status(200).send(health);
  } catch (error) {
    res.status(503).json({
      Status: 503,
      Message: error.message
    });
  }
})

// Default message for invalid requests
app.use((req, res, next) => {
  res.status(400).json({
    Status: 400,
    "Error Message": 'Invalid or bad request!',
    "Request parameters": req.params,
    "Request path": req.path,
    "Request body": req.body,
    "Request headers": req.headers
  })
})



const connectToDB = async () => {
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
    console.log(`[ERROR] - Fatal error while trying to connect to MongoDB cluster. - ${error.message}`)
  }
};

module.exports = { PORT, connectToDB, app }