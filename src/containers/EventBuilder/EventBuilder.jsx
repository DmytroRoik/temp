/* global alert */
import React, { Component } from 'react';
import './EventBuilder.css';
import PropTypes from 'prop-types';
import EventForm from '../../components/CreateEventForm/EventForm.jsx';
import { connect } from 'react-redux';
import { createEvent } from '../../store/actions/calendar';
import moment from 'moment';
import EventNames from '../../components/EventConstructor/EventName/EventNames';
import EventStarts from '../../components/EventConstructor/EventTimeStart/EventStarts';
import EventDuration from '../../components/EventConstructor/EventDuration/EventDuration';

class EventBuilder extends Component {
  static propTypes = {
    events: PropTypes.array,
    token: PropTypes.string,
    calendarId: PropTypes.string,
    createCalendarEvent: PropTypes.func,
    hideEventBuilder: PropTypes.func,
    show: PropTypes.bool
  };

  constructor( props ) {
    super( props );
    this.state = {
      stage: '1',
      errors: {},
      eventNames: ['call','conference'],
      eventStarts: ['now','+3min','+8min','+55min'],
      eventDurations:['5min', '15min', '30min', '60min', '90min'],
    };
    this.newEvent = {};
  }

  onInputHandler = e => {
    if ( e.target.id === 'eventNameInput' ) {
      this.newEvent.summary = e.target.value;
    } else if ( e.target.id === 'eventDescriptionInput' ) {
      this.newEvent.description = e.target.value;
    }
  }

  onChangeDateTimeHandler = ( id, dateTime ) => {
    const errors = { ...this.state.errors };
    if ( id === 'event-start' ) {
      if ( dateTime < moment() - 3 * 60 * 1000 ) {
        errors.eventStart = 'Error!\n Event start in the past';
      } else {
        errors.eventStart = null;
        this.newEvent.start = dateTime;
      }
      this.setState( { errors: errors } );
    } else if ( id === 'event-end' ) {
      this.newEvent.end = dateTime;
    }
      
    if ( this.newEvent.start && this.newEvent.end ) { // validation
      if ( this.newEvent.start - this.newEvent.end >= 0 ) {
        errors.eventEnd = 'The event has start faster than the end!';
        this.setState( {
          errors: errors
        } );
      } else {
        errors.eventEnd = null;
        this.setState( { errors: errors } );
      }
      const conflictEvents = this.getConflictEvents( this.newEvent );
      errors.conflictEvents = conflictEvents;
      this.setState( { errors: errors } );
    }
  }

  getConflictEvents = event => {
    const result = this.props.events.filter( element => {
      const isStartInTheAnotherEvent = moment( event.start ) > moment( element.start ) 
                                    && moment( event.start ) < moment( element.end );
      const isEndInTheAnotherEvent = moment( event.end ) > moment( element.start ) 
                                    && moment( event.end ) < moment( element.end );
      const isEventCoverAnotherEvent = moment( element.start ) > moment( event.start )
                                     && moment( element.end ) < moment( event.end );
      return isStartInTheAnotherEvent || isEndInTheAnotherEvent || isEventCoverAnotherEvent;
    } );
    return result;
  } 

  onBtnNextClickHandler = () => {
    if ( this.state.stage === '1' ) {
      if ( this.newEvent.summary ) {
        this.setState( { stage: '2' } );
        this.setState( { errors: {} } );
      } else {
        this.setState( { errors: {
          summary: 'event name is required'
        } } );
      } 
    } else {
      const isTimePresent = this.newEvent.start && this.newEvent.end;
  
      if ( this.newEvent.summary && isTimePresent ) {
        const isHasErrors = this.state.errors.eventEnd || this.state.errors.conflictEvents.length !== 0 
                              || this.state.errors.eventStart;
        if ( isHasErrors ) {
          alert( 'Room will be busy in this time\n Please select another time' );
          return;
        }
        this.props.createCalendarEvent( this.newEvent, this.props.calendarId, this.props.token );
        this.setState( { stage: '1' } );
        this.props.hideEventBuilder();
      } else {
        alert( 'Please fill all required fields!' );
      }
    }
  }

  onBtnPrevClickHandler = () => {
    if ( this.state.stage === '2' ) {
      this.setState( { stage: '1' } );
    } else {
      this.props.hideEventBuilder();
    }
    this.newEvent = {};
    this.setState( { errors: {} } );// clear errors
  }

  render() {
    if ( this.props.show === false ) {
      return null;
    }
    return (
      <div className = "EventBuilder" >
        <h2>Please choose event type</h2>
        <EventNames 
          names = {this.state.eventNames}
          inputedValue = { this.onInputHandler } 
          error ={ this.state.errors } 
          showCustom={false}
          />
        
        <h2>Please select the start of event</h2>
        <EventStarts
          eventStart = {this.state.eventStarts}
          changeDateTime = {this.onChangeDateTimeHandler} 
          error = { this.state.errors } 
          showCustom = {false}/>
        
        <h2>Please select the duration of the event</h2>
        <EventDuration
          eventDurations = {this.state.eventDurations}
          changeDateTime = {this.onChangeDateTimeHandler} 
          error = { this.state.errors }  
          showCustom = { false }
          />

        <button className="btn-confirm">Confirm</button>

      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    token: state.calendar.access_token,
    calendarId: state.calendar.currentCalendar,
    events: state.calendar.currentCalendarEvents
  };
};
const mapDispatchToProps = dispatch => {
  return {
    createCalendarEvent: ( event, calendarId, access_token ) =>
      dispatch( createEvent( event, calendarId, access_token ) )
  };
};
export default connect( mapStateToProps, mapDispatchToProps )( EventBuilder );
