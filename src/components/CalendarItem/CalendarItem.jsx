import React from 'react';
import './CalendarItem.css';
import PropTypes from 'prop-types';

/**
 * Use: <CalendarItem calendarId=""clicked={event}/>  
 * @param {object} props contains all attr for component
 * @returns {component} stateless react component
 */
const calendarItem = props => (
  <div className = "CalendarItem" onClick = { props.clicked } >
    <div className = "calendarName"> { props.calendarName } </div>
    <div className = "calendarId" > { props.calendarId } </div>
  </div> 
);

calendarItem.propTypes = {
  calendarName: PropTypes.string,
  calendarId: PropTypes.string,
  clicked: PropTypes.func
};

export default calendarItem;
