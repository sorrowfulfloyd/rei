require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const { Schema } = mongoose;

const date = () => new Date().toLocaleString("tr-TR");

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

const DeviceSchema = new Schema({
	device_type: { type: String, required: true, cast: false },
	status: { type: String, default: "Ongoing", cast: false },
	brand: { type: String, required: true, cast: false },
	model: { type: String, required: true, cast: false },
	problem: { type: String, required: true, cast: false },
	accessories: { type: String, required: false, default: "", cast: false },
	note: { type: String, required: false, default: "", cast: false },
	isWorking: { type: Boolean, required: true, cast: false },
	hasWarranty: { type: Boolean, required: true, cast: false },
	owner: { type: mongoose.Types.ObjectId, ref: "Customer", required: true },
	technicianName: { type: String, default: "Admin", cast: false },
	acceptDate: { type: String, required: true, default: date() },
});

const Device = mongoose.model("Device", DeviceSchema);

module.exports = Device;
