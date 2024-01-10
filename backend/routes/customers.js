const express = require("express");
const router = express.Router();

const { getCustomers, deleteCustomer } = require("../controller/customers");

router.route("/").get(getCustomers).delete(deleteCustomer);

module.exports = router;
