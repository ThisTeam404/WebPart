const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('./connection-instance.js');
const Job = require('./job-table.js');

//When integrating enforce the table name globally so that all tables will use the same name as the model name
//Look under section Model Basics to learn how to do this
const LockSmith = sequelize.define('LockSmith', {
    smithID: {
        type: DataTypes.INTEGER.UNSIGNED,  //this id not that important so no need to have mix of characters & digits
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    smithFName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    smithLName: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    tableName: 'LockSmith'
})

LockSmith.hasMany(Job, {
    foreignKey: {
        name: 'smithID',
        allowNull: false
    }
});

Job.belongsTo(LockSmith, {
    foreignKey: {
        name: 'smithID',
        allowNull: false
    }
})


module.exports = LockSmith;