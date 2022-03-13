const { runServer } = require('./my-server/expressServer.js');
const { getData, createNewTuple, updateTuple } = require('./Database/db.js');


runServer();
// postData();
// getAllData();

let testData1 = {
    numkeys: 10,
    numlocks: null,
    cost: null,
    address: null,
    notes:'bird',
    keyway: '',
    combination: '03056',
    unit: null,
    door: null,
    keyLevelType: 'CK',
    hasMk: true,
    bottomPins: null,
    masterPins: null,
    MKCombination: 123,
    MKJobID: null

}



// (async()=>{
    // let myData = await getData();
    // console.log(myData);
    // createNewTuple(testData1);
    updateTuple({jobID: 1, notes: "new note"});

// })()
