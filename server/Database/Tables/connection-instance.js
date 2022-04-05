const {Sequelize, DataTypes} = require('sequelize');
const cls = require('cls-hooked');



const namespace = cls.createNamespace('csc-191');
Sequelize.useCLS(namespace);

const sequelize = new Sequelize("heroku_ed3dae3fae781e9", "b93ab15ea11431", "958d1e89",
{
    host: 'us-cdbr-east-05.cleardb.net',
    port: '3306',
    dialect: 'mysql'
});

try {
    if(sequelize.authenticate()){
      console.log('Connection has been established successfully.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  module.exports = sequelize;