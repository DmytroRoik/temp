import React,{Component} from 'react';
import classes from './RoomManager.css';
import RoomStatus from '../../components/RoomStatusWidget/RoomStatus';
import { connect } from 'react-redux';
import { loadEvents } from '../../store/actions/calendar';

class RoomManager extends Component{
  constructor(props){
    super(props);
    this.state={
      activeEvent: {},
      currentTime: ''
    }
    this.timer=null;
    this.clock=null;
  }

  loadCurrentEvent=()=>{
    this.props.events;
  }
  render(){
    
    return (
      <div className={classes.RoomManager}>
        Room Status
        <RoomStatus status="" eventName="" timeToEventStart="" timeToEventEnd="" description="" currentTime={this.state.currentTime} clicked={''}/>
      </div>
    );
  }
  componentDidMount(){
    const that=this;
    this.timer = setInterval(()=>{// load evetns for calendar from google api every 1 min
      that.props.loadCalenadarEvents(this.props.currentCalendar,this.props.token);
    },60000);
    
    this.clock=setInterval(()=>{
      let t=new Date();
      let time=t.getHours()+":"+ (t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes());
      if(that.state.currentTime!==time){
          this.setState({currentTime: time});
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
    loadCalenadarEvents: (calendarId,token)=>dispatch(loadEvents(calendarId,token))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(RoomManager);