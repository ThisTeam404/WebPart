import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import FetchWrapper from './FetchFolder/fetch-wrapper.js';

export const DBTable = ()=> {

    const myData = [
        // {name: 'James', age: 20},
        // {name: 'Nick', age: 19},
        // {name: 'Tom', age: 23},
        // {name: 'Cruise', age: 25},
        // {name: 'Taylor', age: 26}
        {jobID: '12', cost: 12, address: "100 driveway", status: true},
        {jobID: '13', cost: 500, address: "99 White House Drive", status: true}
    ]



    useEffect(()=> {
        getStudents()
    },[])



    const url = "http://localhost:3000/getKeyTable";

    const [data, setData] = useState(myData);

        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');


        // fetch(url,{
        //     method: 'GET',
        //     headers: {
        //       'Content-Type': 'application/json' }
        //     }).then(resp=>resp.json()).then(myData => {
        //     console.log("Fetched data: " + myData);
        //     setData(myData)})

        console.log('##################################');




    const getStudents = () => {
        fetch(url)
        .then(resp=>resp.json())
        .then(resp=>setData(resp))
                fetch(url,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json' }
            }).then(resp=>resp.json()).then(resp => {
            console.log(`Fetched data:  ${JSON.stringify(resp)}`);
            setData(resp)})
            console.log('@@@@@@@@@@@@@@@@@@@@@');

    }


    const columns = [
        {title: 'Job ID', field: 'jobID'},
        {title: 'Cost', field: 'cost'},
        {title: 'Address', field: 'address'}
        // {title: 'Name', field: 'name'},
        // {title: 'Age', field: 'age'}

    ]
    
    return(
        <div>
            <MaterialTable title="Material Table"
            data = {data}
            columns={columns}
            editable={{
                onRowUpdate: (newData, oldData)=> new Promise((resolve, reject)=>{

                    console.log('onRowUpdate: ' + JSON.stringify(newData));
                    
                    const {jobID} = newData;

                    console.log('The jobID is :' + jobID);
                
                    fetch('http://localhost:3000/updateJobTable', {
                        method: "PUT",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify(newData)
                    })
                    .then(resp=>resp.json())
                    .then(resp=>{
                        getStudents()
                        resolve()
                    })
                })
                
            }}

            />

        </div>
    )
}
