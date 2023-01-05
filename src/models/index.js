const { Sequelize } = require('sequelize')
const { makeFood } = require('./user.model')
const { makeClothes } = require('./clothes.model')
const Collection = require('./class-collection')

const { makeAuthUser } = require('../auth/models/user')

const DATABASE_URL =
    process.env.NODE_ENV === 'test'
        ? 'sqlite::memory:'
        : process.env.DATABASE_URL

const CONNECTION_OPTIONS =
    process.env.NODE_ENV === 'test'
        ? {}
        : {
              ssl: {
                  require: true,
                  rejectUnauthorized: false,
              },
          }

const sequelize = new Sequelize(DATABASE_URL, CONNECTION_OPTIONS)

const Food = makeFood(sequelize)
const Clothes = makeClothes(sequelize)

const AuthUser = makeAuthUser(sequelize)

module.exports = {
    sequelize,
    foodCollection: new Collection(Food),
    clothesCollection: new Collection(Clothes),
    AuthUser,
}
