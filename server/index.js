const { runServer } = require('./my-server/expressServer.js');
const { getAllData, postData, putData, getJobTable } = require('./Database/db.js');


runServer();
// postData();
// getAllData();

// (async()=>{
//     let myData = await getJobTable();
//     console.log(myData);

// })()
