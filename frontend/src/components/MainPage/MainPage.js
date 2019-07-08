import React from 'react';
import { connect } from 'react-redux';

import NavBar from '../NavBar/NavBar';


class MainPage extends React.Component {

  render() {
      if(!this.props.loading) {
        return(
          <div>
            <p>loading...</p>
          </div>
          
        )
      }
    
      return (
        <div className="app">
          < NavBar/>
          
        </div>
      )

  }
}

const mapStateToProps = (state) => ({
    loading: state.loading
  })

export default connect(mapStateToProps)(MainPage)
