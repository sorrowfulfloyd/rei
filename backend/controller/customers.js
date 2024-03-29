const mongoose = require("mongoose");
const Customer = require("../models/customers");
const Device = require("../models/devices");

const getCustomers = async (req, res) => {
	const { id, sort, fields } = req.query;
	const newQuery = {};

	if (id) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: `ID you've given is not valid!` });
		}

		const customer = await Customer.findById(id);
		return customer !== null
			? res.status(200).json({ message: customer })
			: res.status(404).json({
				message: `Couldn't find any object with given data`,
			});
	}

	const result = Customer.find();

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

	const documentCount = await Customer.countDocuments();
	const customers = await result;

	return res.status(200).json({ amount: documentCount, message: customers });
};

const updateCustomer = async (req, res) => {
	const id = req.query.id;
	const payload = req.body;

	console.log("[debug] - req body for updating a customer ", payload, id);

	const customerToBeUpdated = await Customer.findByIdAndUpdate(id, payload, {
		new: true,
		runValidators: false,
	});

	return customerToBeUpdated
		? res.status(200).json("Updated the object successfully")
		: res.status(404).json("Bad id");
};

const deleteCustomer = async (req, res) => {
	const id = req.query.id;

	if (!mongoose.Types.ObjectId.isValid(id) || !id) {
		return res.status(400).json({ message: `ID you've given is not valid!` });
	}

	const owner = await Customer.findById(id);
	const tumbler = [];

	// console.log("binded device IDs ->", owner.devices);

	for (const IDs of owner.devices) {
		if (mongoose.Types.ObjectId.isValid(IDs)) {
			// console.log(IDs, "is a valid id");
			tumbler.push(IDs);
		}
	}

	for await (const tumbled of tumbler) {
		await Device.findByIdAndDelete(tumbled);
	}

	const customerToBeDeleted = await Customer.findByIdAndDelete(id);

	return customerToBeDeleted !== null
		? res.status(200).json({
			message: "Customer is successfully deleted",
			object: { customerToBeDeleted },
		})
		: res
			.status(404)
			.json({ message: `Couldn't find any object with given data` });
};

module.exports = { getCustomers, updateCustomer, deleteCustomer };
