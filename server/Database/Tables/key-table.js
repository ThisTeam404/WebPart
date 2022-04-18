const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('./connection-instance.js');
const Job = require('./job-table.js');

const Key = sequelize.define('KEYLOCK', {
    jobID: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true
    },
    combination: { 
        type: DataTypes.CHAR(5),
        allowNull: false,
        primaryKey: true
    },
    keyway: {
        type: DataTypes.CHAR(3)        
    },
    keyID: {
        type: DataTypes.INTEGER
    },
    unit: {
        type: DataTypes.STRING
    },
    door: {
        type: DataTypes.STRING
    },
    keyLevelType: {
        type: DataTypes.ENUM('CK','MK','GMK')
    },
    hasMK: {
        type: DataTypes.BOOLEAN
    },
    bottomPins: {
        type: DataTypes.CHAR(5)
    },
    masterPins1: {
        type: DataTypes.CHAR(5)
    },
    masterPins2: {
        type: DataTypes.CHAR(5)
    },
    MKCombination: {
        type: DataTypes.CHAR(5)
    },
    MKJobID: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'KEYLOCK',
    timestamps: false

  });

module.exports = Key;