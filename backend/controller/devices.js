const mongoose = require("mongoose");
const Device = require("../models/devices");
const Customer = require("../models/customers");

const getDevices = async (req, res) => {
	const { id, owner, fields, sort, deviceType, repairStatus } = req.query;
	const newQuery = {};

	if (id) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: `ID you've given is not valid!` });
		}

		const device = await Device.findById(id);

		return device !== null
			? res.status(200).json({ message: device })
			: res.status(404).json({
				message: `Couldn't find any object with given data`,
			});
	}

	if (deviceType && deviceType !== "All") {
		newQuery.device_type = deviceType;
	}

	if (repairStatus && repairStatus !== "All") {
		newQuery.status = repairStatus;
	}

	if (owner) {
		newQuery.owner = owner;
	}

	const result = Device.find(newQuery);

	if (fields) {
		const fieldList = fields.split(",").join(" ");
		result.select(fieldList);
	}

	if (sort) {
		const sortList = sort.split(",").join(" ");
		result.sort(sortList);
	} else {
		result.sort("-dateAdded");
	}

	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 50;
	const skip = (page - 1) * limit;

	result.skip(skip).limit(limit);

	// const documentCount = await Device.countDocuments();
	const devices = await result;

	return res.status(200).json({ amount: devices.length, message: devices });
};

const addDevice = async (req, res) => {
	const { deviceInfo, customerInfo, id } = req.body;

	if (Object.keys(req.body).length === 0) {
		return res.status(400).json({ message: "Request body is empty" });
	}
	if (customerInfo) {
		const device = new Device(deviceInfo);
		const owner = new Customer(customerInfo);

		device.owner = owner;
		owner.devices.push(device.id);
		const insertDevice = await device.save();
		const insertedOwner = await owner.save();

		return res.status(200).json({
			message: "Successfully inserted the device",
			object: insertDevice,
			object2: insertedOwner,
		});
	}
	if (id) {
		const device = new Device(deviceInfo);
		const owner = await Customer.findById(id);
		device.owner = owner;
		owner.devices.push(device.id);
		const insertDevice = await device.save();
		const insertedOwner = await Customer.findByIdAndUpdate(id, {
			devices: owner.devices,
		});

		return res.status(200).json({
			message: "Successfully inserted the device",
			object: insertDevice,
			object2: insertedOwner,
		});
	}
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

	// TODO: fix the retardation below, or is it a retardation?
	const deviceId = await Device.findById(id).lean();
	const ownerId = await Customer.findById(deviceId.owner).lean();

	if (ownerId) {
		for (const device_id of ownerId.devices) {
			if (device_id === id) {
				const index = ownerId.devices.indexOf(device_id);
				ownerId.devices.splice(index, 1);
			}
		}

		// console.log("after the loop ", ownerId.devices);

		await Customer.findByIdAndUpdate(
			ownerId._id,
			{ devices: ownerId.devices },
			{ new: true },
		);
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
