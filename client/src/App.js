import './App.css';
import "./web.css"
import React from 'react';
import {DBTable} from './Table.js'
import MyLogin from './components/MyLogin.js';
import Footer from './components/footerComponent.js'


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

  render() { 
    return(<>
        <MyLogin/>
        <DBTable/>
        <Footer/>
      </>
    )
  }
}

export default App;
