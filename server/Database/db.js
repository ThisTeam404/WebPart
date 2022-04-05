const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = require('./Tables/connection-instance.js')
const Key = require('./Tables/key-table.js');
const Job = require('./Tables/job-table.js');


async function getData() {

    const jobData = await Job.findAll({
        attributes:['jobID', 'numkeys', 'numlocks', 'address', 'cost','jobdate','notes'],
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


async function createNewTuple(finalArray) {

    const jobObj = finalArray[0];
    const keyObj = finalArray[1]

    // console.log(finalArray[1][1].hasMK)


    let myJob = {
        numkeys: jobObj.numkeys,
        numlocks: jobObj.numlocks,
        cost: jobObj.cost,
        address: jobObj.address,
        notes: jobObj.notes
        }

  //this function creates the tuple for job table and key table
     sequelize.transaction(async (t1)=>{
        let currentJob = await Job.create(myJob);

    
    //need the currentJob id so that's why we
    //have to create key tuple under same transaction as job tuple
    
    // console.log(`keyway: ${keyObj[0].keyway}`)

    let mkKey = {
        jobID: currentJob.jobID,
        keyway: keyObj[0].keyway,
        combination: keyObj[0].combination,
        unit: keyObj[0].unit,
        door: keyObj[0].door,
        masterPins1: keyObj[0].masterPins1,
        masterPins2: keyObj[0].masterPins2,
        keyLevelType: keyObj[0].keyLevelType,
        hasMK: keyObj[0].hasMK,
        MKJobID: keyObj[0].MKJobID
    }

    let currentMK = await Key.create(mkKey);



    for(const currCK in keyObj){

        // console.log(currCK);
        console.log(keyObj[currCK].hasMK)

    
        if(keyObj[currCK].hasMK && currCK > 0){

            console.log('hasMK is true and does exist')

            let childKey = {
                jobID: currentJob.jobID,
                keyway: keyObj[currCK].keyway,
                combination: keyObj[currCK].combination,
                unit: keyObj[currCK].unit,
                door: keyObj[currCK].door,
                keyLevelType: keyObj[currCK].keyLevelType,
                hasMK: keyObj[currCK].hasMK,
                bottomPins: keyObj[currCK].combination,
                masterPins1: keyObj[currCK].masterPins1,
                masterPins2: keyObj[currCK].masterPins2,
                MKCombination: currentMK.combination,
                MKJobID: currentJob.jobID
            }
            await Key.create(childKey);
        }
        
    }
  

     })
}


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
        await Key.destroy({
            where: {
                jobID: tuple.jobID,
                combination: tuple.combination
            }
        })
    })
}

async function deleteJobTuple() {
    sequelize.transaction(async (t4)=>{
        await Job.destroy({
            where: {
                jobID: tuple.jobID
            }
        })
    })
}


module.exports = { getData, createNewTuple, updateTuple, deleteData };