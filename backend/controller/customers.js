const mongoose = require("mongoose");
const Customer = require("../models/customers");

const getCustomers = async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 50;
	const skip = (page - 1) * limit;

	const documentCount = await Customer.countDocuments();
	const customers = await Customer.find().skip(skip).limit(limit);

	return res.status(200).json({ amount: documentCount, message: customers });
};

const deleteCustomer = async (req, res) => {
	const id = req.query.id;

	if (!mongoose.Types.ObjectId.isValid(id) || !id) {
		return res.status(400).json({ message: `ID you've given is not valid!` });
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

module.exports = { getCustomers, deleteCustomer };
