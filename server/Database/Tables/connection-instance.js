const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize("defaultdb", "doadmin", "dR6cuickQmKxFHjY",
{
    host: 'senior-project-do-user-10762032-0.b.db.ondigitalocean.com',
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