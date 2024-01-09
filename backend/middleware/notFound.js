const notFound = async (req, res, next) => {
  res.status(404).json({ message: 'Page not found / invalid request type' });
}

module.exports = notFound
