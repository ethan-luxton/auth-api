const { DataTypes } = require('sequelize')

function makeClothes(sequelize) {
    return sequelize.define('Clothes', {
        name: DataTypes.STRING,
        group: DataTypes.STRING,
    })
}

module.exports = { makeClothes }
