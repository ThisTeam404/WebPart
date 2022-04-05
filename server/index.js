const { runServer } = require('./my-server/expressServer.js');
const { getData, createNewTuple, updateTuple, deleteKeyTuple,
deleteJobTuple } = require('./Database/db.js');
const finalArray = require('./Database/testData');

const JobTable = require('./Database/Tables/job-table.js');

runServer();



// console.log(finalArray);
// console.log(finalArray[0])
// console.log(finalArray[1]);
// console.log(finalArray[1][0].combination);
// console.log(finalArray[1][1].hasMK);

// for(let i = 1; i < finalArray[1].length; i++){
//     console.log(finalArray[1][i].hasMK)

// }



(async()=>{
    // let myData = await getData();
    // console.log(myData);
    // console.log(finalArray[1][1].hasMK)

    createNewTuple(finalArray);


})()
