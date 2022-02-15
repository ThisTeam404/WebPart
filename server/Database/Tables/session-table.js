const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('./connection-instance.js');

const SessionTable = sequelize.define('Sessions', {
    session_id: {
        type: DataTypes.STRING(32),
        primaryKey: true
    }
});

module.exports = SessionTable;
