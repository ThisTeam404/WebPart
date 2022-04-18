const {Sequelize, DataTypes} = require('sequelize');
const cls = require('cls-hooked');

require('dotenv').config()
//console.log(process.env)

const DATABASE_HOST = process.env.DATABASE_HOST
const DATABASE_PORT = process.env.DATABASE_PORT
const DATABASE_TYPE = process.env.DATABASE_TYPE
const DATABASE_USER = process.env.DATABASE_USER
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
const DATABASE_DIALECT = process.env.DATABASE_DIALECT

const namespace = cls.createNamespace('csc-191');
Sequelize.useCLS(namespace);

const sequelize = new Sequelize(DATABASE_TYPE, DATABASE_USER, DATABASE_PASSWORD,
{
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: DATABASE_DIALECT
});

try {
    if(sequelize.authenticate()){
      console.log('Connection has been established successfully.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  module.exports = sequelize;