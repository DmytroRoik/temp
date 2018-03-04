import React from 'react';
import classes from './RoomStatus.css';

/**
 * Use: <RoomStatus status="" eventName="" timeEventBegin="" timeEventFinish="" description="" currentTime="" timeToNextEvent="" clicked={} BtnName="" />
 * Props: 
 *  {string} status - status of the room ('Available', 'Reserved' or 'Busy') 
 *  {string} eventName -  name of current event
 *  {string} timeToNextEvent -  time to next event in minutes
 *  {string} timeEventBegin -  start time of current event
 *  {string} timeEventFinish -  end time of current event
 *  {string} description -  description of current event(author, some about event)
 *  {string} BtnName - name for bottom button
 */
const roomStatus=(props)=>{
 let statusText="";
 if(props.status==="Available"){statusText=props.status;}
 else if(props.status==="Reserved"){statusText=props.status;}
 else if(props.status==="Busy"){statusText=props.eventName}

  return (
  <div className={classes.RoomStatus}>

    <div className={classes.header}>
      <div className={classes.container}>
        <div className={classes.status}>{statusText}</div>
        { props.status!=="Available"?
          <div>
            <div className={classes.EventDuration}>
              {props.timeEventBegin}
              <span>-</span>
              {props.timeEventFinish}
            </div>
            <p>{props.description}</p>
        </div>
        : <div>
            <div className={classes.EventStart}>
              {'for ' + props.timeToNextEvent.replace(':','h ')+' min' }
            </div>
            <div className={classes.arrow}>&raquo;</div>
          </div>

        }
       </div>
    </div>

    <div className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.clock}>{props.currentTime}</div>
        <button onClick={props.clicked} className={classes.btn}>{props.BtnName}</button>  
      </div>
    </div>
  </div>
);}
export default roomStatus;