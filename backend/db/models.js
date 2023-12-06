require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { Schema } = mongoose;

let date = () => new Date().toLocaleString('tr-TR');

// --------------

// Example request body:
// {
//   "device_type": "laptop",
//   "status": "ongoing",
//   "brand": "Apple",
//   "model": "Macbook Pro",
//   "problem": "Turns up but only has black screen",
//   "accessories": "AC Cord, Mouse, Laptop bag",
//   "isWorking": true,
//   "hasWarranty": false,
//   "hasAdapter": true,
//   "technicianName": "Joseph"
// }

// --------------

const User = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  // signedIn: { type: Boolean },
  creationDate: { type: String, default: date() }
});

const DeviceSchema = new Schema({
  device_type: { type: String, required: true },
  status: { type: String, required: true, default: "ongoing" }, // this could either be ongoing, on-hold, completed, or canceled.
  brand: { type: String, required: true, },
  model: { type: String, required: true, },
  problem: { type: String, required: true, },
  accessories: { type: String, required: false, default: "Belirtilmedi", },
  isWorking: { type: Boolean, required: true, },
  hasWarranty: { type: Boolean, required: true, },
  hasAdapter: { type: Boolean, required: true, },
  technicianName: { type: String, required: true, default: 'Admin', },
  acceptDate: { type: String, required: true, default: date(), }
});

const Device = mongoose.model('Device', DeviceSchema);
const Users = mongoose.model('Users', User);

module.exports = { Device, Users };