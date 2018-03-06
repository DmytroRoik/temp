import React,{Component} from 'react';
import classes from './RoomManager.css';
import RoomStatus from '../../components/RoomStatusWidget/RoomStatus';
import { connect } from 'react-redux';
import { loadEvents } from '../../store/actions/calendar';
import EventBuilder from '../EventBuilder/EventBuilder';
import {toggleEventBuildVisibility} from '../../store/actions/UI';

class RoomManager extends Component{
  constructor(props){
    super(props);
    this.state={
      currentTime: '',
      timeToNextEvent:'',
      room:{
        status:'Available',
        eventName:'',
        description:'',
        timeStart:'',
        timeEnd:'',
        BtnName:''
      },

    }
    this.timer=null;
    this.clock=null;
  }

  loadCurrentEvent=()=>{
    let event = this.props.events[0];
    if(!event){
      this.setState({
        room: {
          status:'Available',
          timeStart: ' - ',
          eventName:'',
          description:'',
          timeEnd:'',
          BtnName:'Quick book for now!',
      }
    });
    }
    let timeToEvent = Date.parse(event.start) - this.state.currentTime;
    
    if( Date.parse(event.start) > this.state.currentTime ){
      if(  timeToEvent > 15 * 60 * 1000 ){
          this.setState({
            room: {
              status:'Available',
              timeStart: timeToEvent,
              eventName:'',
              description:'',
              timeEnd:'',
              BtnName:'Quick book for now!',
          }
        });
      }
      else{
        this.setState({room:{
          status:'Reserved',
          timeStart: timeToEvent,
          BtnName: 'Quick check-in',
          eventName:'',
          description:'',
          timeEnd:'',

        }
      });
      }
      this.setState({timeToNextEvent:timeToEvent});
    }
    else{
      let timeStart=Date.parse(event.start);
      let timeEnd=Date.parse(event.end);
      this.setState({room:{
        status:'Busy',
        eventName: event.name,
        description: 'description',
        timeStart: this.getClock(timeStart),
        timeEnd: this.getClock(timeEnd),
        BtnName: 'View'
      }});        
      }
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
  
  onRoomStatusBtnClickHandler = (btnName) =>{
    if ( btnName === 'Quick book for now!' || btnName === 'Quick check-in' ) {
      this.props.loadEventBuilder();
    }
  }
  render(){
    
    return (
      <div className={classes.RoomManager}>
        <RoomStatus 
          status={this.state.room.status} 
          eventName={this.state.room.eventName} 
          timeEventBegin={this.state.room.timeStart} 
          timeEventFinish={this.state.room.timeEnd}
          timeToNextEvent={this.getClock(this.state.timeToNextEvent)} 
          description={this.state.room.description} 
          currentTime={this.getClock(this.state.currentTime)} 
          BtnName={this.state.room.BtnName}
          clicked={this.onRoomStatusBtnClickHandler}
          />
          <EventBuilder/>
      </div>
    );
  }

  componentDidMount(){
    const that=this;
    
    this.timer = setInterval(()=>{// load evetns for calendar from google api every 1 min
      if(that.props.currentCalendar){
        that.props.loadCalenadarEvents(this.props.currentCalendar,this.props.token);
         that.loadCurrentEvent();
      }
      
    },15000);
    
    this.clock=setInterval(()=>{
      let t=new Date();
      if(that.state.currentTime!==t){
          this.setState({currentTime: t});
        }
    },1000);
  }
  componentWillUnmount(){
    clearInterval(this.timer);
    clearInterval(this.clock);
  }
}


const mapStateToProps = state => {
  return{
    events: state.calendar.currentCalendarEvents,
    token: state.calendar.access_token,
    currentCalendar: state.calendar.currentCalendar
  }
}
const mapDispatchToProps = dispatch => {
  return{
    loadCalenadarEvents: (calendarId,token)=>dispatch(loadEvents(calendarId,token)),
    loadEventBuilder: ()=>dispatch(toggleEventBuildVisibility(true))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(RoomManager);