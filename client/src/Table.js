import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';

export const DBTable = ()=> {

    const myData = [
        {jobID: '12', cost: 12, address: "100 driveway", status: true},
        {jobID: '13', cost: 500, address: "99 White House Drive", status: true}
    ]

    

    
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
            setData(resp)
            //console.log(`From table UI: ${resp}`);

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
    
    return(
        <div>
            <MaterialTable title="Material Table"
            data = {data}
            columns={columns}
            
            editable={{
                // isEditable: rowData => rowData.name === 'Notes',
                onRowUpdate: (newData, oldData)=> new Promise((resolve, reject)=>{
                    fetch(SITE_URL+'/updateJobTable', {
                        method: "PUT",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify(newData)

                    })
                    .then(resp=>resp.json())
                    .then(resp=>{
                        getDatasFromDB()        //Have to call getDatasFromDB() here otherwise it will be called first before the fetch 
                                                //finishes its action
                        resolve()
                    })
                }),
                onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                        fetch(SITE_URL+'/deleteTuple', {
                            method: "DELETE",
                            headers: {
                                "Content-type": "application/json"
                            },
                            body: JSON.stringify(oldData)

                        })
                        .then(resp=>resp.json())
                        .then(resp=>{
                            getDatasFromDB()        //Have to call getDatasFromDB() here otherwise it will be called first before the fetch 
                                                    //finishes its action
                            resolve()
                        })
                })
                
            }}
            

            />

        </div>
    )
}
