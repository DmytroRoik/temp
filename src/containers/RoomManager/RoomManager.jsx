/* global alert */
import React, { Component } from 'react';
import RoomStatus from '../../components/RoomStatusWidget/RoomStatus';
import EventBuilder from '../EventBuilder/EventBuilder';
import { connect } from 'react-redux';
import { loadEvents, loadCurrentEvent, showSettings } from '../../store/actions/calendar';
import Settings from '../Setings/Settings';

class RoomManager extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      currentTime: '',
      isEventBuilderShow: false
    };
    this.timer = null;
    this.clock = null;
  }
  
  onRoomStatusBtnClickHandler = () => {
    this.setEventBuilderVisibility( true );
  }
  setEventBuilderVisibility = show => {
    this.setState( { isEventBuilderShow: show } );
  }
  onScreenClickHandler = () => {
    this.props.toggleSettings( !this.props.settingsVisibility);
  }

  render() {
    return (
      <div onDoubleClick={this.onScreenClickHandler} >
        <RoomStatus 
          status = { this.props.room.status } 
          eventName = { this.props.room.eventName } 
          timeEventBegin = { this.props.room.timeStart } 
          timeEventFinish = { this.props.room.timeEnd }
          timeToNextEvent = { this.props.room.timeToNextEvent } 
          description = { this.props.room.description }
          currentTime = { this.state.currentTime }
          BtnName = { this.props.room.BtnName }
          clicked = { () => this.onRoomStatusBtnClickHandler() }
        />
        <EventBuilder 
          show = { this.state.isEventBuilderShow }
          hideEventBuilder = { () => this.setEventBuilderVisibility( false ) }
        />
        <Settings show={this.props.settingsVisibility}/>
      </div>
    );
  }

  componentDidMount() {
    const that = this;
    
    this.timer = setInterval( () => {// load evetns for calendar from google api every 15sec
      if ( that.props.currentCalendar ) {
        that.props.loadCalenadarEvents( this.props.currentCalendar, this.props.token );
      }
    }, 15000 );
    
    this.clock = setInterval( () => {
      const t = new Date();
      if ( that.state.currentTime !== t ) {
        this.setState( { currentTime: t } );
      }
      this.props.loadCurrentState( this.props.events[0] );
    }, 1000 );
  }
  componentWillUnmount() {
    clearInterval( this.timer );
    clearInterval( this.clock );
  }
}


const mapStateToProps = state => {
  return {
    events: state.calendar.currentCalendarEvents,
    token: state.calendar.access_token,
    currentCalendar: state.calendar.currentCalendar,
    room: state.calendar.room,
    settingsVisibility: state.calendar.settingsVisibility
  };
};
const mapDispatchToProps = dispatch => {
  return {
    loadCalenadarEvents: ( calendarId, token ) => dispatch( loadEvents( calendarId, token ) ),
    loadCurrentState: event => dispatch( loadCurrentEvent( event ) ),
    toggleSettings: show => dispatch( showSettings(show) )
  };
};

export default connect( mapStateToProps, mapDispatchToProps )( RoomManager );
