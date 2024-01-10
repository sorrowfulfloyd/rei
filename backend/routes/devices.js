const express = require("express");
const router = express.Router();

const {
	getDevices,
	addDevice,
	updateDevice,
	deleteDevice,
} = require("../controller/devices");

router
	.route("/")
	.get(getDevices)
	.post(addDevice)
	.delete(deleteDevice)
	.patch(updateDevice);

module.exports = router;
