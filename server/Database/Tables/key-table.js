const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('./connection-instance.js');
const Job = require('./job-table.js');

const Key = sequelize.define('Key', {
    keyID: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true

    },
    unit: DataTypes.STRING,
    keyway: {
        type: DataTypes.STRING,
        allowNull: false
    },
    combination: DataTypes.INTEGER
})

module.exports = Key;