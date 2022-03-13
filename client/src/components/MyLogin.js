import React from 'react';
import '../web.css'
import navLogo from '../LogoIdea1.PNG'

export default class Login extends React.Component {
state = {
    isLoggedin: false,
    status: "",
    data: []
  }
  componentDidMount(){
    this.checkIfLoggedIn()
  }

  checkIfLoggedIn(){
    fetch('http://localhost:3000/auth/isLoggedInCheck', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(resp =>{
          console.log(resp.result)
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

  logout = async () => {
    const rawResponse = await fetch('http://localhost:3000/auth/logout', {
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
        console.log(resp.data)
      })

    this.setState({...this.state, isLoggedin:false})
  };

  fetchSecretStuff(){
    fetch('http://localhost:3000/secret', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(resp =>{
        console.log(resp)
        this.setState({...this.state, data:resp})
      })
      .catch(e => {
            
      });
  }

  fetchDB(){
    fetch('http://localhost:3000/database', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(resp =>{
        console.log(`fetchDB: ${resp}`)
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

  displayLoginHtml(){
    return(
      <div>
        <h1>Smiling Locksmith Database</h1>
        <img src={navLogo} className="mainpic"></img>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="collapse navbar-collapse" id="navbarNavDropdown">          
              <ul className="navbar-nav">
                <li className="nav-item"> 
                      <form className="container-fluid justify-content-start">
                          <button className="button btn btn-outline-success me-2" id="login" type="button" onClick={()=> window.location.href = "http://localhost:3000/auth/login/google"}>Login</button>
                      </form>
                </li>
                <li className="nav-item">
                    <button className="button btn btn-outline-success me-2" type="button" id="login" onClick={() => this.logout()} >Logout</button>
                </li>
                <li className="nav-item">
                    <form className="d-flex">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
                        <button className="button btn btn-outline-success" type="submit">Search</button>
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