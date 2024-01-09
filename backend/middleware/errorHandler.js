const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(403).json({ message: 'Something went wrong!', error: err.message })
  }
  console.log('-----\n[ERR] - from errorHandler\n', err, '-----\n')
  return res.status(500).json({ message: 'Something went wrong!' })
}

module.exports = errorHandler
