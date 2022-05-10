import React from 'react';
import './App.css';
import "./web.css"
import {DBTable} from './Table.js'
import MyLogin from './components/MyLogin.js';
import Footer from './components/footerComponent.js'



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
