import React from 'react';
import classes from './RoomStatus.css';

/**
 * Use: <RoomStatus status="" eventName="" timeToEventStart="" timeToEventEnd="" description="" currentTime="" clicked={}/>
 * Props: 
 *  {string} status - status of the room ('Available', 'Reserved' or 'Busy') 
 *  {string} eventName -  name of current event
 *  {string} timeToEventStart -  start time of current event
 *  {string} timeToEventEnd -  end time of current event
 *  {string} description -  description of current event(author, some about event)
 */
const roomStatus=(props)=>{
 let statusText="";
 if(props.status==="Available"){statusText=props.status;}
 else if(props.status==="Reserved"){statusText=props.status;}
 else if(props.status==="Busy"){statusText=props.eventName}

  return (
  <div className={classes.RoomStatus}>
    <div className={classes.status}>{statusText}</div>

    {props.status!=="Available"?
      <div>
        <div>
          {props.timeToEventStart}
          <span>-</span>
          {props.timeToEventEnd}
        </div>
        <p>{props.description}</p>
      </div>
      :<div className={classes.EventStart}>{props.timeToEventStart}</div>
    }
    <div>&raquo;</div>
    <div>{props.currentTime}</div>
    <button onClick={props.clicked}>{props.BtnName}</button>  
  </div>
);}
export default roomStatus;