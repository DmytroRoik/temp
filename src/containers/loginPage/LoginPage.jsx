import React,{Component} from 'react';
import classes from './LoginPage.css';
import {connect} from 'react-redux';

class LogingPage extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className={classes.LogingPage}>
        <button id="authorize-button" >Authorize</button>
        <div>
          <button id="continue-button" >Continue as = {this.props.calendar} </button>
          <button id="signout-button" >Sign Out</button>
        </div>
      </div>
    );
  }
}
const mapStateToProp = state=>{
  return{
    calendar: state.calendar.calendar
  }
}

const mapDispatchToProp = dispatch=>{
  return{

  }
}

export default connect(mapStateToProp,mapDispatchToProp)(LogingPage);