/* global alert */
import React, { Component } from 'react';
import './EventBuilder.css';
import PropTypes from 'prop-types';
import EventForm from '../../components/CreateEventForm/EventForm.jsx';
import { connect } from 'react-redux';
import { toggleEventBuildVisibility } from '../../store/actions/UI';
import { createEvent } from '../../store/actions/calendar';
import moment from 'moment';

class EventBuilder extends Component {
  static propTypes = {
    events: PropTypes.array,
    token: PropTypes.string,
    calendarId: PropTypes.string,
    createCalendarEvent: PropTypes.func,
    hideEventBuilder: PropTypes.func
  };

  constructor( props ) {
    super( props );
    this.state = {
      stage: '1',
      errors: {}
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

  isRoomIsFree = event => {
    return !this.props.events.some( element => {
      const isStartInTheAnotherEvent = moment( event.start ) > moment( element.start ) 
                                      && moment( event.start ) < moment( element.end );
      const isEndInTheAnotherEvent = moment( event.end ) > moment( element.start ) 
                                    && moment( event.end ) < moment( element.end );
      const isEventCoverAnotherEvent = moment( element.start ) > moment( event.start ) 
                                      && moment( element.end ) < moment( event.end );
      return isStartInTheAnotherEvent || isEndInTheAnotherEvent || isEventCoverAnotherEvent;
    } );
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
      this.setState( { errors: {} } );// clear errors
      this.props.hideEventBuilder();
    }
  }

  render() {
    return (
      <div className = "EventBuilder" >
        <EventForm 
          stage = { this.state.stage } 
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
  return {
    token: state.calendar.access_token,
    calendarId: state.calendar.currentCalendar,
    events: state.calendar.currentCalendarEvents
  };
};
const mapDispatchToProps = dispatch => {
  return {
    hideEventBuilder: () => dispatch( toggleEventBuildVisibility( false ) ),
    createCalendarEvent: ( event, calendarId, access_token ) =>
      dispatch( createEvent( event, calendarId, access_token ) )
  };
};
export default connect( mapStateToProps, mapDispatchToProps )( EventBuilder );
