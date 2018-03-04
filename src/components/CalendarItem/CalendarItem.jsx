import React from 'react';
import classes from './CalendarItem.css';

/**
 * Use: <CalendarItem calendarId=""clicked={event}/>  
 */
const calendarItem=(props)=>(
  <div className={classes.CalendarItem} onClick={props.clicked}>
    <div className={classes.calendarName}>{props.calendarName}</div>
    <div className={classes.calendarId}>{props.calendarId}</div>
  </div>
);
export default calendarItem;