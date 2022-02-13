import logo from './logo.svg';
import './App.css';

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import React, {useState,useEffect} from 'react';
import ReactDOM from 'react-dom';

/*
  - show google log in button
  - on google log in button redirect to google login endpoint on server
  - client will wait for success response from server and then update page to show that user
  has logged in
  - other buttons to fetch data from server

  Things to do:
  - create fetch and update page function
*/



class App extends React.Component{

  state = {
    isLoggedin: false,
    status: "",
    data: []
  }

  componentDidMount(){
    this.checkIfLoggedIn()
  }

  checkIfLoggedIn(){
    fetch('http://localhost:3000/isLoggedInCheck', {
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

  render() { 
    return(
      <div className="App">
        <h1>Hello</h1>
        <p>is logged in {this.state.isLoggedin.toString()}</p>
        
        {this.state.isLoggedin == false && (
          <button 
            title="Sign in with Google"
            onClick={()=> window.location.href = "http://localhost:3000/login/google"}
            value="Sign in with Google"
          >
            Sign in with Google
          </button>
        )}

          <button 
            title="Sign in with Google"
            onClick={()=> this.fetchSecretStuff()}
            value="Sign in with Google"
          >
            Get Secret Stuff
          </button>
        
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
}

export default App;
