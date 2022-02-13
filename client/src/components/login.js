import React, {useState,useEffect} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'

function login()
{
    return(
        <section>
            <div>
                <h1>This is the home page</h1>
                <form action="http://localhost:3000/" method="post">
                    <input type="submit" value="Log in with Google"/>
                </form>
            </div>
        </section>
    )
}