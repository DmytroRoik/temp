import React, { Component } from 'react';
import CalendarList from '../containers/Calendars/CalendarsList';
import { connect } from 'react-redux';
import{loadCalendarApi} from '../store/actions/calendar';
import RoomManager from '../containers/RoomManager/RoomManager';
import EventBuilder from '../containers/EventBuilder/EventBuilder';

class App extends Component {

  render() {
    return ( 
      <div >
        { this.props.calendarListShow? <CalendarList />:
        <RoomManager/>}
        {
          this.props.eventBuilderShow?
          <EventBuilder/>:null
        }
        
        
      </div>
    );
  }
  componentDidMount(){
    this.props.loadCalendars();
  }
}
const mapStateToProp = state=>{
  return{
    calendarListShow: state.UI.calendarListShow,
    eventBuilderShow: state.UI.eventBuilderShow
  }
}

const mapDispatchToProp = dispatch=>{
  return{
    loadCalendars: ()=>dispatch(loadCalendarApi())
  }
}

export default connect(mapStateToProp,mapDispatchToProp)(App);