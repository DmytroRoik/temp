import React,{Component} from 'react';
import classes from './CalendarList.css';

import CalendarItem from '../../components/CalendarItem/CalendarItem';
import { connect } from 'react-redux';
import {createCalendar,loadEvents,selectCalendar, toggleCalendarsListVisibility} from '../../store/actions/calendar';

class CalendarList extends Component{
  constructor(props){
    super(props);
    this.state={
      showCreateCalendarInput: false
    }
  }
  onAddCalendarClickHandler=()=>{
    if(this.state.showCreateCalendarInput ){
      let name= this.newCalendarInput.value.trim()||"";
      let isNameUniq= -1 === this.props.calendars.findIndex( el=>{
        return el.name===name;
      })
      
      if(name && isNameUniq)this.props.createCalendar(name,this.props.token);
      else alert('name must be uniq')
    }
    this.setState((prevState)=>{
      return {
        showCreateCalendarInput: !prevState.showCreateCalendarInput
      }
    })
  }
  onCalendarItemClickHandler=(id)=>{
    this.props.selectCalendar(id);
    this.props.loadCalendarEvents(id,this.props.token);
    this.props.toggleCalendarList(false)
  } 

  render(){
    return (
      <div className={classes.CalendarList}>
        <h2>Select Calendars for device:</h2>
        <ul>
          {this.props.calendars.map(calendar=>{
              return <CalendarItem 
                key={calendar.id}
                calendarId={calendar.id}
                calendarName={calendar.name}
                clicked={()=>this.onCalendarItemClickHandler(calendar.id)}/>
            })
          }
        </ul>
        {this.state.showCreateCalendarInput? 
          <input 
            placeholder="enter name for calendar"
            type="text" 
            ref={inp=>this.newCalendarInput=inp}
            className={classes.newCalendarInput}/>
          :null}
        
        <button 
          onClick={this.onAddCalendarClickHandler}
          className={classes.AddBtn}>+</button>
      </div>
    );
  }
}
const mapStateToProps=state=>{
  return { 
    calendars: state.calendar.allCalendars,
    token: state.calendar.access_token
  }
}

const mapDispatchToProps = dispatch => {
  return{
    createCalendar:(name,token)=>dispatch(createCalendar(name,token)),
    loadCalendarEvents:(calendarId,token)=>dispatch(loadEvents(calendarId,token)),
    selectCalendar:(calendarId)=>dispatch(selectCalendar(calendarId)),
    toggleCalendarList: (isVisible)=>dispatch(toggleCalendarsListVisibility(isVisible)),
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(CalendarList);