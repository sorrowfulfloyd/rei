const mongoose = require("mongoose");
const Device = require("../models/devices");
const Customer = require("../models/customers");

const getDevices = async (req, res) => {
	const id = req.query.id;
	let device;

	if (id) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: `ID you've given is not valid!` });
		}

		device = await Device.findById(id);
		return device !== null
			? res.status(200).json({ message: device })
			: res.status(404).json({
					message: `Couldn't find any object with given data`,
			  });
	}

	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 50;
	const skip = (page - 1) * limit;

	const documentCount = await Device.countDocuments();
	const devices = await Device.find().skip(skip).limit(limit);

	return res.status(200).json({ amount: documentCount, message: devices });
};

const addDevice = async (req, res) => {
	const { deviceInfo, customerInfo } = req.body;

	if (Object.keys(req.body).length === 0) {
		return res.status(400).json({ message: "Request body is empty" });
	}

	const owner = new Customer(customerInfo);
	const device = new Device(deviceInfo);

	device.owner = owner;
	owner.devices.push(device.id);
	const insertDevice = await device.save();
	const insertedOwner = await owner.save();

	return res.status(200).json({
		message: "Successfully inserted the device",
		object: insertDevice,
		object2: insertedOwner,
	});
};

const updateDevice = async (req, res) => {
	const id = req.query.id;
	const payload = req.body;

	console.log("[debug] - req body for updating a device ", payload, id);
	// stupid hack to keep it going, CHANGE THIS LATER
	// if (Object.keys(req.body).length !== 8) {
	// 	return res.status(400).json({ message: "Request body is not right" });
	// }

	const deviceToBeUpdated = await Device.findByIdAndUpdate(id, payload, {
		new: true,
		runValidators: false,
	});

	return deviceToBeUpdated
		? res.status(200).json("Updated the object successfully")
		: res.status(404).json("Bad id");
};

const deleteDevice = async (req, res) => {
	const id = req.query.id;

	if (!mongoose.Types.ObjectId.isValid(id) || !id) {
		return res.status(400).json({ message: `ID you've given is not valid!` });
	}

	const deviceToBeDeleted = await Device.findByIdAndDelete(id);

	return deviceToBeDeleted !== null
		? res.status(200).json({
				message: "Device is successfully deleted",
				object: { deviceToBeDeleted },
		  })
		: res
				.status(404)
				.json({ message: `Couldn't find any object with given data` });
};

module.exports = { getDevices, addDevice, updateDevice, deleteDevice };
