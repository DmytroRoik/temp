import React from 'react';
import './EventNames.css';

const eventNames=(props)=>(
  <div className="EventNames">
    {
      props.names.map(name=>{
        return <button 
          key = {name}  
          className="EventName-item"
          >{name}</button>
      })
    }
    <button onClick={props.customClick} className="EventName-item">custom</button>
    { props.showCustom?
    <div className = "inputFileds" >
      <label
        htmlFor="eventNameInput" >
        Event name:
      </ label >
      <br/>
      < input
        type ="text"
        id = "eventNameInput"
        placeholder = "Enter event name"
        onInput = { props.inputedValue }
      />
      { props.error.summary ?
        <div className = "error" > { props.error.summary } </div>
        : null
      }
   </div>:null }
  </div>
);
export default eventNames;