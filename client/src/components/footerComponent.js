import React from 'react';
import footerImg from '../T404LogoProto1.png'

export default class footer extends React.Component{
    render(){
        return(
            <footer>
            By Team 404
            <img src={footerImg} class="teamlogo"></img>
          </footer>
        )
    }
}
