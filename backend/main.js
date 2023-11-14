require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const DB_ADRESS = process.env.DB_ADDRESS
const PORT = process.env.PORT || 3000;
let retryCountToDatabase = 0;

const { Laptop, TV } = require('./models')
const mongoDB = mongoose.connect(DB_ADRESS);

app.use(express.json());

// Default empty GET request
app.get('/', async (req, res) => {
  try {
    console.log('GET request successful.')
    return res.json({ message: 'Default GET request' });
  } catch (error) {
    console.log(`[ERR] Default GET request has failed! WOW - ${error}`)
    return res.status(500).json({
      Status: 500,
      Message: error.message,
      Message: 'Default GET request has been failed by us'
    })
  }
});

// Get ALL devices from db
app.get('/devices', async (req, res) => {
  try {
    const deviceType = req.query.device_type;
    let devices;
    switch (deviceType) {
      case 'laptop':
        devices = await Laptop.find();
        return res.status(200).json({ laptops: devices });
      case 'tv':
        devices = await TV.find();
        return res.status(200).json(devices);
      default:
        return res.status(404).json({
          Status: 404,
          Error_Message: `Couldn't find any device type with the given one`,
          deviceType: deviceType ? deviceType : "undefined",
          Parameter_List: req.query
        });
    }
  }
  catch (error) {
    console.log(`[ERR] failed to fetch all devices - ${error} - device type: ${deviceType}`)
    return res.status(500).json({
      Status: 500,
      Server_Error_Message: error.message,
    });
  }
})

// Get a device from db by id
app.get('/finddevice', async (req, res) => {
  try {
    const deviceType = req.query.device_type;
    const id = req.query.id;
    let device;
    if (!mongoose.Types.ObjectId.isValid(id) || !(id)) {
      return res.status(400).json({
        Status: 400,
        Code: "Bad request",
        Message: `ID you've given is not valid!`,
        id: id ? id : "undefined",
        Parameter_List: req.query,
      });
    }
    switch (deviceType) {
      case "laptop":
        device = await Laptop.findByIdAndUpdate(id);
        return device !== null ? res.status(200).json({
          status: `Object is successfully deleted`,
          object: { device }
        }) : res.status(404).json({
          Status: 404,
          Message: `Couldn't find any object with given data`,
          id: id ? id : "undefined"
        });
      case "tv":
        device = await TV.findByIdAndUpdate(id);
        return device !== null ? res.status(200).json({
          status: `Object is successfully deleted`,
          object: { device }
        }) : res.status(404).json({
          Status: 404,
          Message: `Couldn't find any object with given data`,
          id: id ? id : "undefined"
        });
      default:
        return res.status(404).json({
          Status: 404,
          Message: `Couldn't find any device type with the given one`,
          device_type: deviceType ? deviceType : "undefined"
        });
    }

  } catch (error) {
    console.log(`[ERR] Couldn't fetch single device from DB. ${error}`);
    return res.status(500).json({
      Status: 500,
      Message: error.message,
    });
  }
});

// Add a device to db
app.post('/devices', async (req, res) => {
  try {
    const deviceType = req.query.device_type;
    let device;
    let insertDevice;
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        Status: 400,
        Code: "Bad request",
        Message: "Request body is empty"
      })
    }
    switch (deviceType) {
      case "laptop":
        device = new Laptop({ ...req.body });
        insertDevice = await device.save();
        return res.status(200).json(insertDevice);

      case "tv":
        device = new TV({ ...req.body });
        insertDevice = await device.save();
        return res.status(200).json(insertDevice);

      default:
        return res.status(400).json({
          Status: 404,
          Code: "Bad request",
          Message: `Couldn't find any device type with the given one`,
          device_type: deviceType ? deviceType : "undefined"
        });
    }
  } catch (error) {
    return res.status(500).json({
      Status: 500,
      Server_Error_Message: error.message,
    });
  }
})

// Delete a device from db
app.delete('/devices', async (req, res) => {
  try {
    const deviceType = req.query.device_type;
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
    switch (deviceType) {
      case 'laptop':
        deviceToBeDeleted = await Laptop.findByIdAndDelete(id);
        return deviceToBeDeleted !== null ? res.status(200).json({
          status: `Object is successfully deleted`,
          object: { deviceToBeDeleted }
        }) : res.status(404).json({
          Status: 404,
          Message: `Couldn't find any object with given data`,
          id: id ? id : "undefined"
        });
      case 'tv':
        deviceToBeDeleted = await TV.findByIdAndDelete(id);
        return deviceToBeDeleted !== null ? res.status(200).json({
          status: `Object is successfully deleted`,
          object: { deviceToBeDeleted }
        }) : res.status(404).json({
          Status: 404,
          Message: `Couldn't find any object with given data`,
          id: id ? id : "undefined"
        });
      default:
        return res.status(404).json({
          Status: 404,
          Message: `Couldn't find any device type with the given one`,
          device_type: deviceType ? deviceType : "undefined"
        });
    }
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
          console.log('Too many tries... Quitting the server. \n');
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

const start = async () => {
  try {
    let mongo = await connectToDB(); // for some reason if we can't connect to db

    console.log(`---------------\n[DATABASE] Status: ${mongo.STATES[mongo.connection.readyState]}`);

    app.listen(PORT, () => {
      console.log(`[SERVER]   Status: connected\nStarted listening on PORT: ${PORT}\n---------------`)
    }
    )

  } catch (error) {
    console.log(error);
  }
}

start();