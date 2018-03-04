import React from 'react';
import classes from './CalendarItem.css';

/**
 * Use: <CalendarItem calendarId=""clicked={event}/>  
 */
const calendarItem=(props)=>(
  <div className={classes.CalendarItem} onClick={props.clicked}>
    <div>{props.calendarName}</div>
    <div>{props.calendarId}</div>
  </div>
);
export default calendarItem;