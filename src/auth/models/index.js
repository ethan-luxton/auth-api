const { sequelize } = require('../../models')
const { makeAuthUser } = require('./user')

const User = makeAuthUser(sequelize)

module.exports = { User }
