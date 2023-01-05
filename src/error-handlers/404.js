const nf = (req, res, next) => res.status(404).send({ message: 'Not found' })

module.exports = nf
