const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = require('./Tables/connection-instance.js')
const Key = require('./Tables/key-table.js');
const Job = require('./Tables/job-table.js');


async function getData() {

    const jobData = await Job.findAll({
        attributes:['jobID', 'numkeys', 'address', 'cost','jobdate','notes'],
        raw: true

    })

    const keyData = await Key.findAll({
        attributes: ['jobID','keyway','combination','unit','door','keyLevelType','hasMK','bottomPins','masterPins1','masterPins2','MKCombination', 'MKJobID'],
        raw: true
    })

    // console.log(keyData[0]);

    const bothObject = keyData.map((currKey=>{

        // console.log(currKey)
        const matchJob = jobData.find(currJob => currJob.jobID == currKey.jobID);


        // console.log(matchJob)
        const tempObj = {...matchJob, ...currKey}
        // console.log(tempObj)

        return tempObj;
        
    }))


    return bothObject;

}

function convertJsonObjectFieldToType(obj, fieldName, type){
    try{
        if (type == "int"){
            obj.fieldName = parseInt(obj.fieldName)
        }
    }catch(e){
        console.log(e)
    }
    
}

function convertJobDataToCorrectDataTypes(job){
    // for case where all data passed in is a string
    convertJsonObjectFieldToType(job, "numkeys", "int")
    convertJsonObjectFieldToType(job, "cost", "int")

    if (job.hasMK == "" || job.hasMK == "false"){
        job.hasMK = false
    }else if(job.hasMK == "true"){
        job.hasMK = true
    }
}

function makeAllEmptyStringInKeyArrNull(keyArr){
    keyArr.forEach((k)=>{
        for(const i in k){
            if(k[i] == ""){
                k[i] = null
            }
        }
    })
}

async function createNewTuple(finalArray) {

    const GMK_STRING = "GMK"
    const MK_STRING = "MK"
    const CK_STRING = "CK"

    const jobObj = finalArray['job']
    const keyObj = finalArray['keys']

    convertJobDataToCorrectDataTypes(jobObj)
    makeAllEmptyStringInKeyArrNull(keyObj)

    let myJob = {
        numkeys: jobObj.numkeys,
        cost: jobObj.cost,
        address: jobObj.address,
        notes: jobObj.notes
        }

  //this function creates the tuple for job table and key table
    try{
        sequelize.transaction(async (t1)=>{
            try{
                let currentJob = await Job.create(myJob);
    
    
                let ourJson = {
                    grandMasterKey:"null",
                    masterKeys:"null",
                    regularKeys:"null"
                }
    
                keyObj.forEach(item =>{
                    item.jobID = currentJob.jobID
                    item.MKJobID = currentJob.jobID
                })
    
                function findKeyInKeyArray(keyArr, targetKeyLevelType){
                    let arr=[]
                    keyArr.forEach(item=>{
                        if(item.keyLevelType == targetKeyLevelType){
                            arr.push(item)
                        }
                    })
                    return arr
                }
    
                function addKeysToJsonObj(keyArr, objJson){
                    // add grand if grand exists
                    const gmkArr = findKeyInKeyArray(keyArr, GMK_STRING)
                    const mkArr = findKeyInKeyArray(keyArr, MK_STRING)
                    const ckArr = findKeyInKeyArray(keyArr, CK_STRING)
    
                    objJson.grandMasterKey = gmkArr
                    objJson.masterKeys = mkArr
                    objJson.regularKeys = ckArr
                    // add master if master exists
                    // add regular if regular exists
                }
    
                addKeysToJsonObj(keyObj, ourJson)
                console.log(ourJson)
    
                if(ourJson.grandMasterKey.length){
                    for(i in ourJson.grandMasterKey){
                        console.log("************* add ketys")
                        await Key.create(ourJson.grandMasterKey[i])
                    }
                }
                if(ourJson.masterKeys.length){
                    for(i in ourJson.masterKeys){
                        console.log("************* add ketys")
                        await Key.create(ourJson.masterKeys[i])
                    }
                }
                if(ourJson.regularKeys.length){
                    for(i in ourJson.regularKeys){
                        console.log("************* add ketys")
                        await Key.create(ourJson.regularKeys[i])
                    }
            }
            }catch(e){
                console.error(e)
            }
        })
    }catch(e){
        console.error(e)
    }
    
    
}

// console.log(finalArray[1][1].hasMK)

    /* Var types for Job
        jobID int NOT NULL AUTO_INCREMENT,
        jobdate datetime DEFAULT CURRENT_TIMESTAMP,
        numkeys int,
        cost dec(7,2),
        address varchar(100),
        notes text,
    */

    /* Var types for KeyLock
        jobID int NOT NULL,
        combination char(5) NOT NULL,
        keyID int NOT NULL AUTO_INCREMENT ,
        keyway char(3),
        unit varchar(100),
        door varchar(50),
        keyLevelType enum('CK', 'MK', 'GMK') NOT NULL,
        hasMK boolean,
        bottomPins char(5),
        masterPins1 char(5),
        masterPins2 char(5),
        MKCombination char(5),
        MKJobID int,
    */

/*
Only allow to modify note field.
No other fields are allowed to be modified.
Done!
*/
async function updateTuple(x) {

    sequelize.transaction(async (t1)=>{
        await Job.update({
            notes: x.notes,    
        }, {
            where: {
                jobID: {
                    [Op.eq]: x.jobID
                }
            }
        })

    })
}


/*
Tuple deletion done!
*/

async function deleteData(tuple){

    await deleteKeyTuple(tuple);
}
async function deleteKeyTuple(tuple) {
    sequelize.transaction(async (t3)=>{
        try{
            await Key.destroy({
                where: {
                    jobID: tuple.jobID,
                    combination: tuple.combination
                }
            })
        }catch(e){
            console.error(e)
        }
    })
}

async function deleteJobTuple() {
    sequelize.transaction(async (t4)=>{
        try{
            await Job.destroy({
                where: {
                    jobID: tuple.jobID
                }
            })
        }catch(e){
            console.error(e)
        }
        
    })

}


module.exports = { getData, createNewTuple, updateTuple, deleteData };