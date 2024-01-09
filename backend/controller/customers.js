const Customer = require('../models/customers')

const getCustomers = async (req, res) => {
  let customers = {};

  if ((await Customer.find()).length > 0) {
    customers = {
      ...customers,
      ...{ customers: await Customer.find() }
    }
    return res.status(200).json(customers);
  }
  return res.status(404).json({ message: "Database is empty" });
}

module.exports = getCustomers;
