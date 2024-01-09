const Customer = require('../models/customers')

const getCustomers = async (req, res) => {

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const documentCount = await Customer.countDocuments();
  const customers = await Customer.find().skip(skip).limit(limit);

  return res.status(200).json({ amount: documentCount, message: customers });
}

module.exports = getCustomers;
