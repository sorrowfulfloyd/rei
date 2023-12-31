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
  username: { type: String, required: true, cast: false },
  email: { type: String, required: true, cast: false },
  password: { type: String, required: true, cast: false },
  // signedIn: { type: Boolean },
  creationDate: { type: String, default: date() }
});

const DeviceSchema = new Schema({
  device_type: { type: String, required: true, cast: false },
  status: { type: String, default: "ongoing", cast: false },
  brand: { type: String, required: true, cast: false },
  model: { type: String, required: true, cast: false },
  problem: { type: String, required: true, cast: false },
  accessories: { type: String, required: false, default: "", cast: false },
  note: { type: String, required: false, default: "", cast: false },
  isWorking: { type: Boolean, required: true, cast: false },
  hasWarranty: { type: Boolean, required: true, cast: false },
  customerName: { type: String, required: true, cast: false },
  customerPhone: { type: String, required: true, cast: false },
  notif: { type: Boolean, required: true, default: false, cast: false },
  ads: { type: Boolean, required: true, default: false, cast: false },
  technicianName: { type: String, default: 'Admin', cast: false },
  acceptDate: { type: String, required: true, default: date(), }
});

const Device = mongoose.model('Device', DeviceSchema);
const Users = mongoose.model('Users', User);

module.exports = { Device, Users };