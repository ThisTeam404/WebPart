const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('./connection-instance.js');
const Key = require('./key-table.js');

const Job = sequelize.define('Job', {
    jobID: {
        type:DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    jobDate: {
        type: DataTypes.DATEONLY,
    },
    numbKeys: DataTypes.INTEGER.UNSIGNED,
    numbLocks: DataTypes.INTEGER.UNSIGNED,
    cost: DataTypes.DECIMAL(10,2),
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    note: DataTypes.TEXT,
    
})

Job.hasMany(Key, {
    foreignKey: {
        name: 'jobID',
        primaryKey: true,
        allowNull: false
    }
});

Key.belongsTo(Job, {
    foreignKey:{
        name: 'jobID',
        primaryKey: true,
        allowNull: false
    }
})

module.exports = Job;