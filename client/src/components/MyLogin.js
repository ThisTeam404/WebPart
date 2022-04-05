import React from 'react';
import '../web.css'

import {DBTable} from '../Table.js'

const WEB_MODE_ENABLED = false

const PORT = process.env.PORT || 3000;
const SITE_URL = WEB_MODE_ENABLED ? 'https://web-login-test1.herokuapp.com' : 'http://localhost:'+ PORT 

export default class Login extends React.Component {
  state = {
      isLoggedin: false,
      apiKey: "",
      status: "",
      data: []
    }
  
  componentDidMount(){
    setTimeout(this.checkIfLoggedIn.bind(this), 2000) // delay to login check is needed so that check does not occur before auth process on server has finished
    setInterval(this.getAPIKey.bind(this), 5000)
    console.log("Component mounted")
  }

  checkIfLoggedIn(){
    fetch(SITE_URL + '/auth/isLoggedInCheck', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
      
    })
      .then(response => {
        //console.log(response)
        return response.json()
      })
      .then(resp =>{
          //console.log(resp.result)
          if (resp.result == "false"){
            this.setState({isLoggedin: false, status:"", data:[]})
          }else if(resp.result == "true"){
            this.setState({isLoggedin: true, status:"", data:[]})
          }else{
            this.setState({isLoggedin: false, status:"ERROR: did not ge back true or false", data:[]})
          }
      })
      .catch(e => {
            this.setState({isLoggedin: false, status: e.message, data:[]});
      });
  }

  getAPIKey(){
    console.log("Getting API Key")
    fetch(SITE_URL + '/getAPIKey', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
      
    })
      .then(response => {
        //console.log(response)
        return response.json()
      })
      .then(resp =>{
          console.log(resp[0].data)
          const key = resp[0].data 
          if (key != ""){
            this.setState({...this.state, apiKey:key})
          }else if(resp.result == "true"){
            this.setState({isLoggedin: true, status:"", data:[]})
          }else{
            this.setState({...this.state, status:"ERROR: did not ge back true or false", apiKey:""})
          }
      })
      .catch(e => {
            console.log(e)
            this.setState({isLoggedin: false, status: e.message, data:[]});
      });
  }

  logout = async () => {
    const rawResponse = await fetch(SITE_URL + '/auth/logout', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({data: "This is data from react"})
    })
    const content = rawResponse;
  
    content.json()
      .then(resp =>{
        //console.log(resp.data)
      })

    this.setState({...this.state, isLoggedin:false, apiKey:""})
  };

  fetchSecretStuff(){
    fetch(SITE_URL + '/sendSecretStuff', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({data: "APPLE PIE"})
    })
      .then(response => {
        //console.log(response)
        return response.json()
      })
      .then(resp =>{
        //console.log(resp)
        this.setState({...this.state, data:resp})
      })
      .catch(e => {
            
      });
  }

  fetchGetApiKey(){
    fetch(SITE_URL + '/database', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        //console.log(response)
        return response.json()
      })
      .then(resp =>{
        //console.log(`fetchDB: ${resp}`)
        this.setState({...this.state, data:resp[0]})
      })
      .catch(e => {
            
      });
  }

  fetchDB(){
    fetch(SITE_URL + '/database', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        //console.log(response)
        return response.json()
      })
      .then(resp =>{
        //console.log(`fetchDB: ${resp}`)
        this.setState({...this.state, data:resp})
      })
      .catch(e => {
            
      });
  }


  render() { 
    return(
      <div className="App">
        
        {this.displayLoginHtml()}

        <div className="content">
          <p>is logged in {this.state.isLoggedin.toString()}</p>
          {this.displayAPICode()}

          <button
            className='button btn btn-outline-success me-2' 
            title="fetch secret stuff"
            onClick={()=> this.fetchSecretStuff()}
            value="fetch secret stuff"
          >
            Get Secret Stuff
          </button>

          <button 
            title='Fetch Database' 
            onClick={()=> this.fetchDB()}
            className='button btn btn-outline-success me-2'
          >
              Fetch Databsse
          </button>
          {/* <button title='Fetch Database' onClick={()=> DBTable()}>Get Table </button> */}
          
        </div>

        {this.displaySecretDetails()}
        {this.state.isLoggedin ? <DBTable/> : false}

      </div>
    )
  }

  displaySecretDetails(){
    if(this.state.isLoggedin == false){
      return
    }

    return (
    <div>
      {this.state.data.map((d) => (
          <p>{d.data}</p>
      ))}
    </div>)
  }

  displayAPICode(){
    if(this.state.apiKey == ""){
      return(
        <p>API Key: </p>
      )
    }
    return(
      <p>API Key: {this.state.apiKey}</p>
    )
  }

  displayLoginHtml(){
    let button
    if(!this.state.isLoggedin){
      button = ()=>{return <button className="button btn btn-outline-success me-2" id="login" type="button" onClick={()=> window.location.href = SITE_URL+"/auth/login/google"}>Login</button>}
    }else{
      button = ()=>{return <button className="button btn btn-outline-success me-2" type="button" id="login" onClick={() => this.logout()} >Logout</button>}
    }

    return(
      <div>
        <h1>Smiling Locksmith Database</h1>

        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="collapse navbar-collapse" id="navbarNavDropdown">          
              <ul className="navbar-nav">
                <li className="nav-item"> 
                      <form className="container-fluid justify-content-start">
                        {button()}
                      </form>
                </li>
              </ul>
            </div>
          </nav>
      </div>
    )
  }

  /* This is old code for showing the login
  {this.state.isLoggedin == false && (
    <button 
      title="Sign in with Google"
      onClick={()=> window.location.href = "http://localhost:3000/auth/login/google"}
      value="Sign in with Google"
    >
      Sign in with Google
    </button>
  )}
  */

}
