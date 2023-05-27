import React from "react";

export default function Nav(){
    return(
        <div className="Nav">
            <div className="Box">
                <div className="logo">
                    <h1>SARC</h1>
                </div>
                <div className="naviele">


                 {/* <input type="checkbox" className="toggleMenu"></input>
                 <div className="hamburger"></div> */}


                <ul className="menu">
                    <li><a href="">home</a></li>
                    <li><a href="">about</a></li>
                    <li><a href="">contact</a></li>
                    <li><a href="">developers</a></li>
                </ul>
                </div>
                <div className="sarcLogo">
                    <img src="sarc-logo.svg"></img>
                </div>
            </div>
        </div>
    )
}