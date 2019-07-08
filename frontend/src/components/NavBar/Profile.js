import React from 'react';
import { connect } from 'react-redux';
import {changeUrl, } from '../../actions';

class Profile extends React.Component {
    render() {
        return (
        <a href="#" onClick={() => {this.props.onToProfile(this.props.username); return false;}}>PROFILE</a>
        )
    }
}

let mapStateToProps = (state) => {
  return{
    username: state.authorization !== null? Object.assign(state.authorization).split(":")[0]:null,
  }
}


let mapDispatchToProps = (dispatch) => {
    return {
        onToProfile: (username) => dispatch(changeUrl('/profile/'+username+"/"))

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);