import React, { Component } from 'react';
import './EventBuilder.css';

import EventForm from '../../components/CreateEventForm/EventForm';
import { connect } from 'react-redux';
import { toggleEventBuildVisibility } from '../../store/actions/UI';
import { createEvent } from '../../store/actions/calendar';
import moment from 'moment';

class EventBuilder extends Component{
  constructor ( props ) {
    super ( props );
    this.state = {
      stage: 1,
      errors: {}
    }
    this.newEvent = {};
  }

  onInputHandler=(e)=>{
    if ( e.target.id === "eventNameInput" ) {
      this.newEvent.summary = e.target.value;
    }
    else if ( e.target.id === "eventDescriptionInput" )
      this.newEvent.description = e.target.value;
  }

  /**
   * @param { string } id --id of parent`s input element
   * @param { moment } dateTime -- date and time in moment object 
   */
  onChangeDateTimeHandler = ( id, dateTime ) => {
    if ( id === "event-start" )
      this.newEvent.start = dateTime;
    else if ( id === "event-end" )
      this.newEvent.end = dateTime;

    if( this.newEvent.start && this.newEvent.end ) {//validation
      if( this.newEvent.start - this.newEvent.end >= 0) {
        this.setState( {
           errors: {
            eventEnd: "The event has start faster than the end!"
            }
          });
      }
      else {
        this.setState( {
          errors: {
            eventEnd: null
           }
         });
      }
      let conflictEvents = this.getConflictEvents ( this.newEvent );
      this.setState( { errors: {
        conflictEvents : conflictEvents
      }});

    }
  }

  getConflictEvents = ( event ) =>{
    let result = this.props.events.filter( (element, index, array) => {
      let isStartInTheAnotherEvent = moment( event.start ) > moment( element.start ) && moment( event.start ) < moment( element.end );
      let isEndInTheAnotherEvent = moment( event.end ) > moment( element.start ) && moment( event.end ) < moment( element.end );
      let isEventCoverAnotherEvent = moment( element.start ) > moment ( event.start ) && moment( element.end ) < moment( event.end );
      return isStartInTheAnotherEvent || isEndInTheAnotherEvent || isEventCoverAnotherEvent;
    });
    return result;
  } 

  isRoomIsFree = ( event ) => {
    return !this.props.events.some( ( element, index, array )=>{
      let isStartInTheAnotherEvent = moment( event.start ) > moment( element.start ) && moment( event.start ) < moment( element.end );
      let isEndInTheAnotherEvent = moment( event.end ) > moment( element.start ) && moment( event.end ) < moment( element.end );
      let isEventCoverAnotherEvent = moment( element.start ) > moment ( event.start ) && moment( element.end ) < moment( event.end );
      return  isStartInTheAnotherEvent || isEndInTheAnotherEvent || isEventCoverAnotherEvent;
    })
  }

  onBtnNextClickHandler = e =>{
    if( this.state.stage===1 ){
      if ( this.newEvent.summary ){
        this.setState( { stage: 2 } );
        this.setState( { errors: {} } );
      } 
      else{
        this.setState( { errors: {
         summary: "event name is required"
        }
      })
      } 
    }
    else {
      let isTimePresent = this.newEvent.start && this.newEvent.end;
      if( this.newEvent.summary && isTimePresent ) {
        this.props.createCalendarEvent ( this.newEvent, this.props.calendarId, this.props.token );
        this.setState( { stage: 1 } );
        this.props.hideEventBuilder();
      }
      
    }
  }

  onBtnPrevClickHandler = e => {
    if ( this.state.stage === 2 ) {
      this.setState ( { stage: 1 } );
    }
    else {
      this.setState( { errors: {} });//clear errors
      this.props.hideEventBuilder();
    }
  }

  render() {
    if ( !this.props.isEventBuilderShown ) return null;
    return (
      <div className = "EventBuilder" >
        <EventForm 
          stage = {this.state.stage} 
          clickedBack = { this.onBtnPrevClickHandler } 
          clickedNext = { this.onBtnNextClickHandler }
          inputedValue = { this.onInputHandler } 
          changeDateTime = {this.onChangeDateTimeHandler } 
          error = { this.state.errors }
          />
      </div>
    );
  }
}
const mapStateToProps = state => {
  return{
    isEventBuilderShown: state.UI.eventBuilderShow,
    token: state.calendar.access_token,
    calendarId: state.calendar.currentCalendar,
    events: state.calendar.currentCalendarEvents
  }
}
const mapDispatchToProps = dispatch => {
  return {
    hideEventBuilder: () => dispatch ( toggleEventBuildVisibility ( false ) ),
    createCalendarEvent: ( event, calendarId, access_token ) => dispatch ( createEvent ( event,calendarId, access_token ) )
  }
}
export default connect ( mapStateToProps, mapDispatchToProps ) ( EventBuilder );