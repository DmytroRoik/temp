import React,{Component} from 'react';
import './RoomManager.css';
import RoomStatus from '../../components/RoomStatusWidget/RoomStatus';
import { connect } from 'react-redux';
import { loadEvents, loadCurrentEvent } from '../../store/actions/calendar';
import {toggleEventBuildVisibility} from '../../store/actions/UI';
import { getClock, getTimeString } from '../../service/util';

class RoomManager extends Component{
  constructor(props){
    super(props);
    this.state={
      currentTime: ''
    }
    this.timer=null;
    this.clock=null;
  }
  
  onRoomStatusBtnClickHandler = (btnName) =>{
    if ( btnName === 'Quick book for now!' || btnName === 'Quick check-in' ) {
      this.props.loadEventBuilder();
    }
    else if (btnName === 'View') alert('To be continued!');
  }

  render(){
    return (
      <div >
        <RoomStatus 
          status = { this.props.room.status } 
          eventName = { this.props.room.eventName } 
          timeEventBegin = { getClock( this.props.room.timeStart ) } 
          timeEventFinish = { getClock( this.props.room.timeEnd ) }
          timeToNextEvent = { getTimeString( this.props.room.timeToNextEvent) } 
          description = { this.props.room.description } 
          currentTime = { getClock( this.state.currentTime ) } 
          BtnName = { this.props.room.BtnName }
          clicked = { () => this.onRoomStatusBtnClickHandler( this.props.room.BtnName ) }
          />
      </div>
    );
  }

  componentDidMount() {
    const that = this;
    
    this.timer = setInterval( () =>{// load evetns for calendar from google api every 15sec
      if( that.props.currentCalendar ) {
         that.props.loadCalenadarEvents( this.props.currentCalendar, this.props.token );
      }
    },15000);
    
    this.clock=setInterval( () => {
      let t=new Date();
      if(that.state.currentTime !==t ) {
          this.setState({ currentTime: t});
        }
        this.props.loadCurrentState( this.props.events[0] );
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
    loadCurrentState: ( event) => dispatch ( loadCurrentEvent( event ) )
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( RoomManager );