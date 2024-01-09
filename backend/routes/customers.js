const express = require('express')
const router = express.Router();

const getCustomers = require('../controller/customers')

router.route('/').get(getCustomers)

module.exports = router;
