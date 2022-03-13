const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('./connection-instance.js');
const Key = require('./key-table.js');

const Job = sequelize.define('JOB', {
    jobID: {
        type:  DataTypes.INTEGER.UNSIGNED ,
        primaryKey: true,
        autoIncrement: true
    },
    numkeys: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    numlocks: {
        type: DataTypes.INTEGER.UNSIGNED
    },
    cost: {
        type: DataTypes.DECIMAL(7,2)
    },
    address: {
        type: DataTypes.STRING
    },
    notes: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'JOB',
    timestamps: false

})




module.exports = Job;