const ise = (err, req, res, next) => {
    console.error(err)
    res.status(500).send({ message: 'there was a problem' })
}

module.exports = ise
