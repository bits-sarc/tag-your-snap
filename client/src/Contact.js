import React from "react";

export default function Contact(){
    return(
        <div className="contactUs">
           <div className="sarcdesc">
               <h1>SARC</h1>
               <p>Student Alumni Relations Cell is a student body of BITS Pilani, Pilani Campus working under the aegis of the Dean of Alumni Relations Divison.</p>
           </div>

           <div className="aboutUs">
             <a href="https://bits-sarc.org" target="_blank"><h2>about us</h2></a>
             <ul>
                <li><a href="https://bits-sarc.org" target="_blank">initiatives</a></li>
                <li><a href="https://open.spotify.com/show/3z8808lf1AB9NspMNufPqr?si=2263db3199704fa4" target="_blank">the podcast</a></li>
                <li><a href="https://bits-sarc.org/#portfolio" target="_blank">gallery</a></li>
             </ul>
           </div>

           <div className="connect">
            <h2>connect w/ us</h2>
            <p>follow us on social media to receive regular updates</p>

            <div className="socials">
              
                <a href="https://www.facebook.com/sarcbitspilani" target="_blank"><img src="facebook-logo.svg"></img></a>
                <a href="https://twitter.com/sarcbitspilani" target="_blank"><img src="twitter-logo.svg"></img></a>
                <a href="https://www.instagram.com/sarcbitspilani/" target="_blank"><img src="insta-logo.svg"></img></a>
                <a href="https://www.linkedin.com/company/sarcbitspilani/?original_referer=https%3A%2F%2Fyearbook.bits-sarc.org%2F" target="_blank"><img src="linkedin-logo.svg"></img></a>
              
            </div>

           </div>
        </div>
    )
}