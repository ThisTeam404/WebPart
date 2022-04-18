import MaterialTable from 'material-table';
import React, {useEffect, useState} from 'react';

export const DBTable = ()=> {

    const myData = []

    function jobObj(jobID, cost, address, status, notes, numKeys, keys){
        this.jobID = jobID
        this.cost = cost
        this.address = address
        this.status = status
        this.notes = notes
        this.numKeys = numKeys
        this.keys = keys
    }

    // sort dataFromDB by jobs, so each row will be jobs
    function groupDataFromDbByJobs(arrayOfKeysToSort){
        let jobArr = []

        arrayOfKeysToSort.forEach(element => {
            let job = jobArr.find((e)=>e.jobID == element.jobID)

            if(job){
                job.keys.push(element)
            }else {
                // create job object and add element to job object
                let job = new jobObj(
                    element.jobID, 
                    element.cost,
                    element.address,
                    true,
                    element.notes,
                    element.numkeys,
                    [element]
                )
                jobArr.push(job)
            }
        })
        return jobArr
    }
        // jobs row columns = jobID, numkeys, notes
        // job row contains many rows of keys
        // key row = everything key has
    
    useEffect(()=> {
        getDatasFromDB()
    }, [data]);
    
    /* 
        - have endpoint that returns all job and key data sorted into json object:
            {
                jobarr[] {
                    grandMaster
                    master
                    regular
                }
            }
    */

    const PORT = process.env.PORT || 3000;
    const SITE_URL = process.env.REACT_APP_WEB_MODE_ENABLED == "false" ? "http://localhost:" + PORT : process.env.REACT_APP_WEBSITE_URL 
    const url = SITE_URL+"/getData";

    const [data, setData] = useState(myData);

    const getDatasFromDB = () => {
        fetch(url)
        .then(resp=>resp.json())
        .then(resp=>{
            setData(groupDataFromDbByJobs(resp))
            //setData(resp)
            console.log(`From table UI: ${resp}`)
            console.log('@@@@@@From ui Table \n %j}', data)

        })

    }

    const columns = [
        {title: 'Job ID', field: 'jobID',editable: 'never'},
        {title: 'Brand', field: 'keyway', editable: 'never'},
        {title: 'Combination', field: 'combination', editable: 'never'},
        {title: 'KeyLevelType', field: 'keyLevelType',editable: 'never'},
        {title: 'Bottom Pins', field: 'bottomPins', editable: 'never'},
        {title: 'Master Pins 1', field: 'masterPins1', editable: 'never'},
        {title: 'Master Pins 2', field: 'masterPins2', editable: 'never'},
        {title: 'Mk Combination', field: 'MKCombination', editable: 'never'},
        {title: 'Unit', field: 'unit', editable: 'never'},
        {title: 'Door', field: 'door', editable: 'never'},
        {title: 'Cost', field: 'cost',editable: 'never'},
        {title: 'Address', field: 'address',editable: 'never'},
        {title: 'NumKeys', field: 'numkeys',editable: 'never'},
        {title: 'Notes', field: 'notes'},

    ]

    function createColumnObject(titleVal, fieldVal, headerStyleObj){
        return { title: titleVal, field: fieldVal, headerStyleObj}
    }

    const colHeaderStyler = {headerStyle: { backgroundColor: "gray", color: "white" }}

    function createMainMaterialTable(){
        console.log('######From ui Table \n %j}', data)
        return(
            <MaterialTable
                title="Jobs"
                columns={[
                    createColumnObject("JobID", "jobID", colHeaderStyler),
                    createColumnObject("Cost", "cost", colHeaderStyler),
                    createColumnObject("Address", "address", colHeaderStyler),
                    createColumnObject("NumKeys", "numKeys", colHeaderStyler),
                    createColumnObject("Notes", "notes", colHeaderStyler),
                ]}
                data={data}
                detailPanel={rowData => {
                   return(
                        <MaterialTable
                            title=""
                            columns={columns}
                            data={rowData.keys}
                            style={{
                                backgroundColor: '#198754'
                            }}
                        />
                   )
                }}
            />
        )
    }

    function createNestedMaterialTable(rowData){
        console.log(`rowdata %j`, rowData)
        return(
            <MaterialTable
                title=""
                columns={columns}
                data={rowData.keys}
                style={{
                backgroundColor: "aliceblue"
                }}
            />
        )
    }
    
    return(
        createMainMaterialTable()   
    )
}
