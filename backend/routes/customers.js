const express = require("express");
const router = express.Router();

const {
	getCustomers,
	updateCustomer,
	deleteCustomer,
} = require("../controller/customers");

router
	.route("/")
	.get(getCustomers)
	.delete(deleteCustomer)
	.patch(updateCustomer);

module.exports = router;
