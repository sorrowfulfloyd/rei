const mongoose = require('mongoose');
const { Schema } = mongoose;

let date = () => new Date().toLocaleString('tr-TR');

const LaptopSchema = new Schema({
  device_type: {
    type: String,
    default: "laptop"
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  problem: {
    type: String,
    required: true,
  },
  accessories: {
    type: String,
    required: false,
    default: "Belirtilmedi",
  },
  isWorking: {
    type: Boolean,
    required: true,
  },
  hasWarranty: {
    type: Boolean,
    required: true,
  },
  hasAdapter: {
    type: Boolean,
    required: true,
  },
  technicianName: {
    type: String,
    required: true,
    default: 'Admin',
  },
  acceptDate: {
    type: String,
    required: true,
    default: date(),
  }
});

const TVSchema = new Schema({
  brand: { type: String, required: true, },
  model: { type: String, required: true, },
  problem: { type: String, required: true, },
  accessories: { type: String, required: false, default: "Belirtilmedi" },
  isWorking: { type: Boolean, required: true, },
  hasWarranty: { type: Boolean, required: true, },
  hasRemote: { type: Boolean, required: false, default: false },
  technicianName: { type: String, required: true, default: 'Admin', },
  acceptDate: { type: Date, required: true, default: Date.now, },
});

const Laptop = mongoose.model('Laptop', LaptopSchema);
const TV = mongoose.model('TV', TVSchema);

module.exports = { Laptop, TV };