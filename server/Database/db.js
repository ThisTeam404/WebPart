const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = require('./Tables/connection-instance.js')

// const LockSmith = require('./Tables/locksmith-table.js');
const Key = require('./Tables/key-table.js');
const Job = require('./Tables/job-table.js');


async function getData() {

    //Has to be in this order
    //because otherwise not all rows of data will be retrieved
    //due to the fact that there could be more Key instances than Jobs instances and 
    //LockSmith instances. One job can have multiple keys. One smith can have
    //multiple jobs

    // const data = await Key.findAll({
    //     attributes:['jobID', 'combination']
        // include: {
        //     model: Job,
        //     attributes: ['jobID', 'numkeys'],
        //     required: true
        // }
    // });

    const data = await Job.findAll({
        attributes:['jobID', 'numkeys', 'numlocks']

        
    })


    return data;


    // let mydata = sequelize.transaction(async (t1)=>{
    //     return await Key.findAll({
    //         include: {
    //             model: Job,
    //             include: [
    //                 LockSmith
    //             ],
    //             required: true
    //         }
    
    //     })
    // })


    console.log('***********************************************');
    console.log('***********************************************');
    console.log('***********************************************');
    console.log('***********************************************');

}


async function createNewTuple(data) {

    let myJob = {
        numkeys: data.numkeys,
        numlocks: data.numlocks,
        cost: data.cost,
        address: data.address,
        notes: data.notes
        }

  
     sequelize.transaction(async (t1)=>{
        let currentJob = await Job.create(myJob);


        let mkKey = {
            jobID: currentJob.jobID,
            keyway: data.keyway,
            combination: '03056',
            unit: data.unit,
            door: data.door,
            keyLevelType: 'MK',
            hasMk: false
        }

        let currentMK = await Key.create(mkKey);

        
        let childKey = {
            jobID: currentJob.jobID,
            keyway: data.keyway,
            // combination: `${data.combination.concat('5')}`,
            combination: data.combination,
            unit: data.unit,
            door: data.door,
            keyLevelType: data.keyLevelType,
            hasMk: data.hasMk,
            bottomPins: currentMK.combination,
            masterPins: data.masterPins,
            MKCombination: currentMK.combination,
            MKJobID: data.jobID
        }

  

        if(data.hasMk){
            await Key.create(childKey);

        }

     })

    //  sequelize.transaction(async(t2)=>{
    //      await Key.create(myKey);
    //  })

}


//Right now only allowing update on the note field
async function updateTuple(x) {

    sequelize.transaction(async (t1)=>{
        await Job.update({
            // jobID: x.cost,
            // jobDate: x.jobDate,
            // numbKeys: x.numbKeys,
            // numbLocks: x.numbLocks,
            // cost: x.cost,
            notes: x.notes
            // address: x.address,

    
        }, {
            where: {
                jobID: {
                    [Op.eq]: x.jobID
                }
            }
        })

    })

    //Currently, we dont udpate anything from key attributes
    sequelize.transaction(async (t2)=>{
        await Key.update({

        }, {
            where:{
                jobID: {
                    [Op.eq]: x.jobID
                },
                combination: {
                    [Op.eq]: x.combination
                }
            }
        })
    })
}



//Delete is the same idea as the updateTuple() method
//However, deleting data will be more complicated
//in the sense that the data have relationship
//so must address those relationship.
//Some factors include:
/** 1. one job having many keys
 *   and we only want to delete an instance
 *  of a key
 * 2. we want to delete a job who happens to
 * have a lot of key instances
 * 3. we want to allow deleting of locksmith 
 * instances but our querying algorithm is based on
 * keys and jobs associated with those keys and locksmith
 * associated with the jobs. Thus, locksmith with no 
 * job will not be query. Need to address this later in future.
 * 
 */
//Will work on deleting in future sprint
//because need to know what the table library sends
//back when deleting
//

async function deleteData() {

}


module.exports = { getData, createNewTuple, updateTuple };