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
        type: DataTypes.STRING(5)
    },
    masterPins: {
        type: DataTypes.STRING(5)
    },
    MKCombination: {
        type: DataTypes.STRING(5)
    },
    MKJobID: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'KEYLOCK',
    timestamps: false

  });

//   (async ()=> {
//     await Key.sync({alter:true})


//   })()

module.exports = Key;