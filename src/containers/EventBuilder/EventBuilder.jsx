/* global alert */
import React, { Component } from 'react';
import './EventBuilder.css';
import EventForm from '../../components/CreateEventForm/EventForm.jsx';
import { connect } from 'react-redux';
import { createEvent } from '../../store/actions/calendar';
import moment from 'moment';
import EventNames from '../../components/EventConstructor/EventName/EventNames';
import EventStarts from '../../components/EventConstructor/EventTimeStart/EventStarts';
import EventDuration from '../../components/EventConstructor/EventDuration/EventDuration';
import ConflictEvents from '../../components/EventConstructor/ConflictEvents/ConflictEvents';

class EventBuilder extends Component {

  constructor( props ) {
    super( props );
    this.deltaHours = 60 - moment().minute();
    if(this.deltaHours > 30) this.deltaHours -= 30;
    this.state = {
      errors: {},
      
      eventNames: ['call','conference'],
      eventStarts: ['now',`+${this.deltaHours}min`,`+${this.deltaHours + 30}min`, `+${this.deltaHours + 60}min`],
      eventDurations:['5min', '15min', '30min', '45min','60min', '90min'],
      
      activeName: '',
      activeEvStart: '',
      activeEvDuration: '',

      customNameShow: false,
      customEvStart: false,
      customEvDuration: false
    };
    this.newEvent = {};
    this.timer = null;
  }

  shouldComponentUpdate(nextProps, nextStatet){
    if(nextProps.show!==true&&this.props.show!==true)return false;
    else return true;
  }
  onInputHandler = e => {
      this.newEvent.summary = e.target.value;
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
      if(!this.newEvent.start){
        this.newEvent.start = moment();
        
        this.setState({activeEvStart:'now'});
      }
    }
    this.checkEventErrors();
  }
  checkEventErrors = () => {
    const errors = { ...this.state.errors };
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
  
  onNameItemClickHandler = sender => {
    this.newEvent.summary = sender;
    this.setState({customNameShow: false});
    this.setState({activeName: sender});
  }

  onCustomNameItemHandler = sender => {
    this.setState({activeName: sender});
    this.setState((prevState,prevProps)=>{
      return { customNameShow: !prevState.customNameShow }
    });
  }
  
  onEvStartItemClickHandler = sender => {
    this.setState({activeEvStart: sender});
    let curTime = moment();
    let delta = sender.replace('+','').replace('min', '');
    if (sender === 'now'){
      this.newEvent.start = curTime;
    }
    else {
      this.newEvent.start = curTime.add(delta,'minutes');
    }
    this.setState({customEvStart: false});
    this.checkEventErrors();
  }
  
  onCustomEvStartItemClickHandler = sender => {
    this.setState({activeEvStart: sender});
    this.setState((prevState,prevProps)=>{
      return { customEvStart: !prevState.customEvStart }
    });
  }

  onEvDurationItemClickHandler = sender => {
    this.setState({activeEvDuration: sender});
    let duration = sender.replace('min','');
    if(!this.newEvent.start){
      this.newEvent.start = moment();
      this.setState({activeEvStart:'now'});
    }
    this.newEvent.end = moment(this.newEvent.start).add(duration, 'minutes');
    this.checkEventErrors();
  }

  onCustomEvDurationItemClickHandler = sender => {
    this.setState({activeEvDuration: sender});
    this.setState((prevState, prevProps)=>{
      return { customEvDuration: !prevState.customEvDuration }
    });
  }

  onConfirmClickHandler = () => {
    if(!this.newEvent.summary){
      this.newEvent.summary = 'Event';
    }
    if ( this.newEvent.start && this.newEvent.end ) {
      const isHasErrors = this.state.errors.eventEnd || this.state.errors.conflictEvents.length !== 0 
                            || this.state.errors.eventStart;
      if ( isHasErrors ) {
        alert( 'Room will be busy in this time\n Please select another time' );
        return;
      }
      this.props.createCalendarEvent( this.newEvent, this.props.calendarId, this.props.token );
      this.setState({
        activeName: '',
        activeEvStart: '',
        activeEvDuration: '',
      });
      this.props.hideEventBuilder();
      this.newEvent={};
    } else {
      alert( 'Please choose time for event!' );
    }
  }

  render() {
    if ( this.props.show === false ) {
      return null;
    }
    return (
      <div className = "EventBuilder" >
        <ConflictEvents error={this.state.errors}/>
        <h2>Please choose event type</h2>
        <EventNames 
          active = {this.state.activeName}
          itemClick = {this.onNameItemClickHandler}
          names = {this.state.eventNames}
          inputedValue = { this.onInputHandler } 
          error ={ this.state.errors }
          customClick = {this.onCustomNameItemHandler}
          showCustom={ this.state.customNameShow}
          />
        
        <h2>Please select the start of event</h2>
        <EventStarts
          active = {this.state.activeEvStart}
          itemClick = {this.onEvStartItemClickHandler}
          eventStart = {this.state.eventStarts}
          changeDateTime = {this.onChangeDateTimeHandler} 
          error = { this.state.errors } 
          customClick = {this.onCustomEvStartItemClickHandler}
          showCustom = {this.state.customEvStart}/>
        
        <h2>Please select the duration of the event</h2>
        <EventDuration
          active = {this.state.activeEvDuration}
          itemClick = {this.onEvDurationItemClickHandler}
          eventDurations = {this.state.eventDurations}
          changeDateTime = {this.onChangeDateTimeHandler} 
          error = { this.state.errors }
          customClick = {this.onCustomEvDurationItemClickHandler}
          showCustom = { this.state.customEvDuration }
          />

        <button className="btn-confirm" onClick = { this.onConfirmClickHandler }>Confirm</button>
      </div>
    );
  }
  componentDidMount(){
    const that = this
    that.timer=setInterval(()=>{
      that.deltaHours = 60 - moment().minute();
      if(that.deltaHours > 30) that.deltaHours -= 30;
      that.setState({
        eventStarts: ['now',`+${that.deltaHours}min`,`+${that.deltaHours + 30}min`, `+${that.deltaHours + 60}min`]
      });
    })
  }
  componentWillUnmount(){
    clearInterval(this.timer);
    this.timer = null;
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
