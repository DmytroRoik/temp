import React from 'react';
import './CalendarItem.css';

/**
 * Use: <CalendarItem calendarId=""clicked={event}/>  
 */
const calendarItem = ( props ) => (
  <div className = "CalendarItem" onClick = { props.clicked } >
    <div className = "calendarName"> { props.calendarName } </div>
    <div className = "calendarId" > { props.calendarId } </div>
  </div>
);
export default calendarItem;