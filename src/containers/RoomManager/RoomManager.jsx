import React,{Component} from 'react';
import classes from './RoomManager.css';
import RoomStatus from '../../components/RoomStatusWidget/RoomStatus';
import { connect } from 'react-redux';
import { loadEvents, loadCurrentEvent } from '../../store/actions/calendar';
import EventBuilder from '../EventBuilder/EventBuilder';
import {toggleEventBuildVisibility} from '../../store/actions/UI';

class RoomManager extends Component{
  constructor(props){
    super(props);
    this.state={
      currentTime: ''
    }
    this.timer=null;
    this.clock=null;
  }

  /**
   * Convert integer time to hh:mm format
   * @param {integer} dateTime - time in integer format
   * @returns {string} - time in hh:mm format 
   */
  getClock(dateTime){
    let time = new Date(dateTime);
    return time.getHours() + ":" + (time.getMinutes()<10 ? "0" + time.getMinutes(): time.getMinutes());
  }

  /**
   * @param { number } dateTime -- time in number format 
   */
  getTimeString( dateTime ){
    let minutes = Math.floor( dateTime / 1000 / 60 );

    let h = Math.floor( minutes / 60 );
    let m = minutes - h * 60;
    return h + ":" + m;
  }
  
  onRoomStatusBtnClickHandler = (btnName) =>{
    if ( btnName === 'Quick book for now!' || btnName === 'Quick check-in' ) {
      this.props.loadEventBuilder();
    }
  }
  render(){
    
    return (
      <div className = { classes.RoomManager } >
        <RoomStatus 
          status = { this.props.room.status } 
          eventName = { this.props.room.eventName } 
          timeEventBegin = { this.getClock( this.props.room.timeStart ) } 
          timeEventFinish = { this.getClock( this.props.room.timeEnd ) }
          timeToNextEvent = { this.getTimeString( this.props.room.timeToNextEvent) } 
          description = { this.props.room.description } 
          currentTime = { this.getClock( this.state.currentTime ) } 
          BtnName = { this.props.room.BtnName }
          clicked = { this.onRoomStatusBtnClickHandler }
          />
          <EventBuilder/>
      </div>
    );
  }

  componentDidMount() {
    const that = this;
    
    this.timer = setInterval( () =>{// load evetns for calendar from google api every 1 min
      if( that.props.currentCalendar ) {
         that.props.loadCalenadarEvents( this.props.currentCalendar, this.props.token );
      }
    },30000);
    
    this.clock=setInterval( () => {
      let t=new Date();
      if(that.state.currentTime !==t ) {
          this.setState({ currentTime: t});
        }
    },1000);
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
    room: state.calendar.room
  }
}
const mapDispatchToProps = dispatch => {
  return {
    loadCalenadarEvents: (calendarId,token)=>dispatch(loadEvents( calendarId, token ) ),
    loadEventBuilder: ()=>dispatch( toggleEventBuildVisibility( true ) ),
    loadCurrentState: ( event, curTime ) => dispatch ( loadCurrentEvent( event, curTime ) )
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( RoomManager );