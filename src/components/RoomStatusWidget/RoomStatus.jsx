import React from 'react';
import './RoomStatus.css';
import { getClock, getTimeString } from '../../service/util';
import AttendeeItem from '../Attendees/AttendeeItem/AttendeeItem';

/**
 * Use: <RoomStatus status="" eventName="" timeEventBegin="" timeEventFinish="" description="" currentTime="" timeToNextEvent="" attendies=[] clicked={} BtnName="" />
 * Props: 
 *  {string} status - status of the room ('Available', 'Reserved' or 'Busy') 
 *  {string} eventName -  name of current event
 *  {string} timeToNextEvent -  time to next event in minutes
 *  {string} timeEventBegin -  start time of current event
 *  {string} timeEventFinish -  end time of current event
 *  {string} description -  description of current event(author, some about event)
 *  {string} BtnName - name for bottom button
 */
const roomStatus = props => {
  let statusText = '';
  if ( props.status === 'Available' ) {
    statusText = props.status; 
  } else if ( props.status === 'Reserved' ) {
    statusText = 'Available'; 
  } else if ( props.status === 'Busy' ) {
    statusText = props.eventName;
  }

  let timeToEvent = '';
  let time = props.timeToNextEvent;
  
  if ( getTimeString(props.timeToNextEvent) === '0' ) {
    timeToEvent = 'less than 1 minute';
  } else if ( getTimeString(props.timeToNextEvent)  === '- :-'  || time > 864e5 ) {
    timeToEvent = 'free for today';
  } else {
    timeToEvent = (<span>the nearest time in <br/>{`${getTimeString(props.timeToNextEvent).replace( ':', 'h ' )} min`}</span> );
  }
  return (
    <div className = "RoomStatus" >
      <div className = { `header header-${props.status}`} >
        <div className = { `container container-${props.status}`} >
          <div className = { `status status-${props.status}`} > {statusText}</div>
          { props.status === 'Busy' ?
            <div>
              <div className = "EventDuration" >
                {getClock(props.timeEventBegin) }
                <span>-</span>
                { getClock(props.timeEventFinish) }
              </div>
              <div className = "Attendees-section">
                <ul className = "Attendees-list">
                  { (props.attendees || []).map(a => <li>
                    <AttendeeItem name={a.name} img={a.img}/>
                  </li>)}
                </ul>
              </div>
            </div>
            : <div>
              <div className = "EventStart" >
                { timeToEvent }
              </div>
              <div className = { `arrow arrow-${ props.status }`} > &raquo; </div>
            </div>
          }
        </div>
      </div>

      <div className = { `footer footer-${ props.status }`} >
        <div className = "container" >
          <div className = "clock" > { getClock(props.currentTime) } </div>
          <button
            to = "/newEvent"
            onClick = { props.clicked } 
            className = { `btn btn-${props.status}`}
          >
            { props.BtnName }
          </button>  
        </div>
      </div>
    </div>
  );
};
export default roomStatus;
