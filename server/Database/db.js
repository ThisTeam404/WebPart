const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = require('./Tables/connection-instance.js')

const LockSmith = require('./Tables/locksmith-table.js');
const Key = require('./Tables/key-table.js');
const Job = require('./Tables/job-table.js');


async function getAllData() {

    //Has to be in this order
    //because otherwise not all rows of data will be retrieved
    //due to the fact that there could be more Key rows than Jobs and 
    //LockSmith rows. One job can have multiple keys. One smith can have
    //multiple jobs

    const joinedTable = await Key.findAll({
        include: {
            model: Job,
            include: [
                LockSmith
            ],
            required: true
        }

    });

    console.log('***********************************************');
    console.log('***********************************************');
    console.log("AllData: " + JSON.stringify(joinedTable, null, 2));
    console.log('***********************************************');
    console.log('***********************************************');

}

//will most likely use this method
//for inserting test data because the front end
//wont have the feature to allow inserting new instances
//of table (so basically new rows of data)
async function postData() {

    console.log('***********************************************');
    console.log('***********************************************');
    console.log("POST data ran!!!!");
    console.log('***********************************************');
    console.log('***********************************************');


    //we should NOT call create Locksmith all the time
    //only need a few locksmith not a different one for
    //every job
    // await LockSmith.create({smithFName: 'Taylor', smithLName: 'Fong'});

    let myJob = {
        "jobID": 55,
        "jobDate": null,
        "numbKeys": null,
        "numbLocks": null,
        "cost": "22.34",
        "address": "667 Lock Ave",
        "note": null,
        "smithID": 3
    }
    let myKey = {
        "keyID": 2,
        "unit": "110",
        "keyway": "KW13",
        "combination": 1000,
        "createdAt": "2022-02-25T06:21:02.000Z",
        "updatedAt": "2022-02-25T06:21:02.000Z",
        "jobID": 55,

    }

    let mySmith = {
            "smithID": 4,
            "smithFName": "Lebron",
            "smithLName": "James",

        }
        // await Job.create(myJob);
        // await Key.create(myKey);
        // await LockSmith.create(mySmith);


    // await LockSmith.create({"smithID": 4, "smithFName": "Lebron","smithLName": "James"
    // await Job.create({address: '119 StarWay', cost:20.25, smithID: 2});
    // await Key.create({unit: "110", keyway: "KW13", combination: 1000, jobID: 2});

    // })
}

const myObject = {
    tableName: "LockSmith",
    myData: {
        lastName: "Xiong",
        id: 1
    }
};

// putData(myObject);

async function putData(x) {

    switch (x.tableName) {
        case "LockSmith":
            await LockSmith.update({
                smithLName: x.myData.lastName
            }, {
                where: {
                    smithID: {
                        [Op.eq]: x.myData.id
                    }
                }
            })
            break;
        case "Job":
            break;
        case "Key":
            break;
    }

}



//Delete is the same idea as the putData() method
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

//I can use bulk update to update multiple rows per table (not tables) at once
//Will leave it for next sprint




module.exports = { getAllData, postData, putData };