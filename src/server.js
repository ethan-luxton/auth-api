const express = require('express')
const { foodRoutes } = require('./routes/food.route')
const { clothesRoutes } = require('./routes/clothes.route')
const logger = require('./middleware/logger')
const errorHandler = require('./error-handlers/500')
const notFound = require('./error-handlers/404')
// const sequelize = require('./auth/models/user');
const { checkToken, authRoutes } = require('./auth')

const server = express()
const PORT = process.env.PORT || 3002
server.use(authRoutes)
server.use(logger)
server.use(express.json())

server.use(foodRoutes)
server.use(clothesRoutes)

server.get('/loggedin', checkToken, (req, res) => {
    res.status(200).send('You are logged in, ' + req.username)
})

server.use('*', notFound)

server.use(errorHandler)

const start = () => {
    server.listen(PORT, () => console.log('listening on port', PORT))
}
// async () => {await sequelize.drop();}
module.exports = {
    server,
    start,
}
