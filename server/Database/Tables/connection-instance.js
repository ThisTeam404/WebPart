const {Sequelize, DataTypes} = require('sequelize');
const cls = require('cls-hooked');



const namespace = cls.createNamespace('csc-191');
Sequelize.useCLS(namespace);

const sequelize = new Sequelize("defaultdb", "doadmin", "AVNS_cg4fmsbMEuF061I",
{
    host: 'db-csus-do-user-11282781-0.b.db.ondigitalocean.com',
    port: '25060',
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