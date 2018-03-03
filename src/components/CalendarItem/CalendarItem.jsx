import React from 'react';
import classes from './CalendarItem.css';

/**
 * Use: <CalendarItem calendarId="" isActive={false||true} clicked={event}/>  
 */
const calendarItem=(props)=>(
  <div className={classes.CalendarItem} onClick={props.clicked}>
  <div>{props.calendarName}</div>
    <div>{props.calendarId}</div>
    {props.isActive?<span>current</span>:null}
  </div>
);
export default calendarItem;