import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import FetchWrapper from './FetchFolder/fetch-wrapper.js';

export const DBTable = ()=> {

    const myData = [
        {jobID: '12', cost: 12, address: "100 driveway", status: true},
        {jobID: '13', cost: 500, address: "99 White House Drive", status: true}
    ]


    /*
    useEffect(()=> {
        getDatasFromDB()
    }, [data]);
    */


    const WEB_MODE_ENABLED = false

    const PORT = process.env.PORT || 3000;
    const SITE_URL = WEB_MODE_ENABLED ? 'https://web-login-test1.herokuapp.com' : 'http://localhost:'+ PORT 

    const url = SITE_URL+"/getKeyTable";

    const [data, setData] = useState(myData);
    /*
    const getDatasFromDB = () => {
        fetch(url)
        .then(resp=>resp.json())
        .then(resp=>{
            setData(resp)
            console.log(`From table UI: ${resp}`);
        })

    }
    */

    const columns = [
        {title: 'Job ID', field: 'jobID'},
        {title: 'Cost', field: 'cost'},
        {title: 'Address', field: 'address'}

    ]
    
    return(
        <div>
            <MaterialTable title="Material Table"
            data = {data}
            columns={columns}
            /*
            editable={{
                onRowUpdate: (newData, oldData)=> new Promise((resolve, reject)=>{
                
                    /*
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
                })
                
            }}
            */

            />

        </div>
    )
}
