import './App.css';
import "./web.css"
import React from 'react';
import {DBTable} from './Table.js'
import MyLogin from './components/MyLogin.js';
import Footer from './components/footerComponent.js'


/*
  - further investigate bug where first login attempt will not automatically log in user
*/



class App extends React.Component{  

  render() { 
    return(
      <div className='mainClass'>
        <MyLogin/>
        <Footer/>
      </div>
    )
  }
}

export default App;
