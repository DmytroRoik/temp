import React,{Component} from 'react';
import classes from './CalendarList.css';

import CalendarItem from '../../components/CalendarItem/CalendarItem';
import { connect } from 'react-redux';
import {createCalendar,loadEvents,selectCalendar} from '../../store/actions/calendar';

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
      
      if(name && isNameUniq)this.props.createCalendar(name);
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
    this.props.loadCalendarEvents(id);
  }
  render(){
    return (
      <div className={classes.CalendarList}>
        <h4>All calendars:</h4>
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
          <input type="text" ref={inp=>this.newCalendarInput=inp}/>
          :null}
        
        <button onClick={this.onAddCalendarClickHandler}>+</button>
      </div>
    );
  }
}
const mapStateToProps=state=>{
  return { 
    calendars: state.calendar.allCalendars
  }
}

const mapDispatchToProps = dispatch => {
  return{
    createCalendar:(name)=>dispatch(createCalendar(name)),
    loadCalendarEvents:(calendarId)=>dispatch(loadEvents(calendarId)),
    selectCalendar:(calendarId)=>dispatch(selectCalendar(calendarId))
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(CalendarList);