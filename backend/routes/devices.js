const express = require('express')
const router = express.Router();

const { getDevices, addDevice, deleteDevice } = require('../controller/devices')

router.route('/').get(getDevices).post(addDevice)
router.route('/:id').delete(deleteDevice)

module.exports = router;
