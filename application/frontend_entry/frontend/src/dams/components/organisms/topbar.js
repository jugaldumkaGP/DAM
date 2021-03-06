import React, { Component } from 'react';
import alchemylogo from "/application/frontend/src/dams/images/alchemylogo.png";
import "/application/frontend/src/dams/css/topbar.css";
import {Link} from "react-router-dom";  
import {SearchComponent} from "/application/frontend/src/dams/components/organisms/search/search.js"

export class TopBar extends Component{

render(){
   
    return(
     
      <div className="row topbar">
        <div className="col-md-3">
           <Link to="/"><img src={alchemylogo} className="alchemy-logo" align="left"/></Link>
        </div>  

        <div className="col-md-5">
          <SearchComponent filterProps={this.props.filterProps} renderResults={(newdata) =>this.props.toSetState(newdata)}/>
        </div>   
           
        <div className="col-md-3 loginicon">
          <i className="fas fa-user-circle fa-4x s-profile col-md-offset-10 dropdown-toggle " id="menu2" data-toggle="dropdown">
            <ul className="dropdown-menu" role="menu1">
                <li><a tabIndex="-1" href="#">Manage Profile</a></li>
                <li><a tabIndex="-1" href="#">Back to DAM</a></li>
                <li><a tabIndex="-1" href="#">Logout</a></li>
            </ul>
          </i>
        </div> 
        </div>
      
      
        )
   }
}