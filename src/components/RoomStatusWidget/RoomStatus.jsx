import React from 'react';
import  './RoomStatus.css';

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
const roomStatus = ( props ) => {
 let statusText = "";
 if( props.status === "Available" ) { statusText = props.status; }
 else if( props.status === "Reserved" ) { statusText = "Available"; }
 else if( props.status === "Busy" ){statusText=props.eventName}

  return (
  <div className = "RoomStatus" >

    <div className = { `header header-${ props.status }`} >
      <div className =  { `container container-${ props.status }`} >
        <div className = { `status status-${ props.status }`} > {statusText}</div>
        { props.status === "Busy" ?
          <div>
            <div className = "EventDuration" >
              { props.timeEventBegin }
              <span>-</span>
              { props.timeEventFinish }
            </div>
            <p className = "description" > { props.description } </p>
        </div>
        : <div>
            <div className = "EventStart" >
              {'for ' + props.timeToNextEvent.replace(':','h ')+' min' }
            </div>
            <div className = { `arrow arrow-${ props.status }`} > &raquo; </div>
          </div>
        }
       </div>
    </div>

    <div className = { `footer footer-${ props.status }`} >
      <div className = "container" >
        <div className = "clock" > { props.currentTime } </div>
        <button 
          onClick = { props.clicked( props.BtnName ) } 
          className = { `btn btn-${ props.status }`}
          >
          { props.BtnName }
        </button>  
      </div>
    </div>
  </div>
);}
export default roomStatus;