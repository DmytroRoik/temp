import React, { Component } from 'react';
import classes from './EventBuilder.css';
import EventForm from '../../components/CreateEventForm/EventForm';
import { connect } from 'react-redux';
import { toggleEventBuildVisibility} from '../../store/actions/UI';
import { createEvent } from '../../store/actions/calendar';

class EventBuilder extends Component{
  constructor ( props ) {
    super ( props );
    this.state = {
      stage: 1
    }
    this.newEvent = {};
  }

  onInputHandler=(e)=>{
    if ( e.target.id === "eventNameInput" ) 
      this.newEvent.summary = e.target.value;
    else if ( e.target.id === "eventDescriptionInput" )
      this.newEvent.description = e.target.value;
  }

  /**
   * @param { string } id --id of parent`s input element
   * @param { string } dateTime -- date and time in ISO format 
   */
  onChangeDateTimeHandler = ( id, dateTime ) => {
    if ( id === "event-start" )
      this.newEvent.start = dateTime;
    else if ( id === "event-end" )
      this.newEvent.end = dateTime;
  }
  onBtnNextClickHandler=(e)=>{
    if(this.state.stage===1)this.setState({stage: 2});
    else {
      this.props.crateCalendarEvent ( this.newEvent, this.props.calendarId, this.props.token );
      this.props.hideEventBuilder();
    }
  }
  onBtnPrevClickHandler = ( e ) => {
    if ( this.state.stage === 2 ) this.setState ( { stage: 1 } );
    else {
      this.props.hideEventBuilder();
    }
  }
  render() {
    if ( !this.props.isEventBuilderShown ) return null;
    return (
      <div className = { classes.EventBuilder } >
        <EventForm 
          stage = {this.state.stage} 
          clickedBack = { this.onBtnPrevClickHandler } 
          clickedNext = { this.onBtnNextClickHandler }
          inputedValue = { this.onInputHandler } 
          changeDateTime = {this.onChangeDateTimeHandler } 
          />

      </div>
    );
  }
}
const mapStateToProps = state => {
  return{
    isEventBuilderShown: state.UI.eventBuilderShow,
    token: state.calendar.access_token,
    calendarId: state.calendar.currentCalendar
  }
}
const mapDispatchToProps = dispatch => {
  return {
    hideEventBuilder: () => dispatch ( toggleEventBuildVisibility ( false ) ),
    crateCalendarEvent: ( event, calendarId, access_token ) => dispatch ( createEvent ( event,calendarId, access_token ) )
  }
}
export default connect ( mapStateToProps, mapDispatchToProps ) ( EventBuilder );