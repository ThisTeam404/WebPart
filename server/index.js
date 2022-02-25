const { runServer } = require('./my-server/expressServer.js');
const { getAllData, postData, putData } = require('./Database/db.js');


runServer();
getAllData();
postData()