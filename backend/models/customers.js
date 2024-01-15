const mongoose = require("mongoose");
const { Schema } = mongoose;

const CustomerSchema = new Schema({
	name: { type: String, required: true, cast: false },
	phone: { type: String, required: true, cast: false },
	notif: { type: Boolean, required: true, cast: false },
	ads: { type: Boolean, required: true, cast: false },
	devices: { type: [String], cast: false },
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
