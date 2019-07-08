import React from 'react';
import { connect } from 'react-redux';
import {changeUrl} from '../../actions';
import Logout from './Logout';
import Login from './Login';
import Join from './Join';
import Profile from './Profile';

class NavBar extends React.Component {
    render() {
       
        if(this.props.loggedIn !== ""){
          return(
            <div>
              <header className="clear">
               <div className="wrap">
                 <div className="logo" onClick={() => this.props.onClick()}></div>
                 <nav className="navBar">
                   <ul>
                     
                     <li><Profile/></li>
                     <li><Logout/></li>
                   </ul>
                 </nav>
               </div>
             </header>
           </div>

          )
        }
        else{
        return (
        <div>
          <header className="clear">
           <div className="wrap">
             <div className="logo" onClick={() => this.props.onClick()}></div>
             <nav className="navBar">
               <ul>
                 <li><Login/></li>
                 <li><Join/></li>
               </ul>
             </nav>
           </div>
         </header>
       </div>
        )
      }
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        onClick: () => dispatch(changeUrl('/'))
    }
}
const mapStateToProps = (state) => ({
    loggedIn: state.authorization,
})

NavBar = connect(mapStateToProps, mapDispatchToProps)(NavBar);



export default NavBar;
