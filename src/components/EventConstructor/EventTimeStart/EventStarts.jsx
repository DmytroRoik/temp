import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import './EventStarts.css';

const eventStarts=(props)=>{
  return (
  <MuiThemeProvider>
    <div className="EventStarts">
    {
      props.eventStart.map(start=>{
        return <button 
          className="EventStart-item"
          onClick = {() => props.itemClick(start)}>{start}</button>
      })
    }
    <button onClick={props.customClick} className="EventStart-item">custom</button>
    { props.showCustom?
      <div className = "inputFileds" >
        <DateTimePicker
          returnMomentDate = { true }
          onChange = { dateTime => props.changeDateTime( 'event-start', dateTime ) }
          id = "event-start"
          floatingLabelText = "Event start"
          format = 'MMM DD, YYYY HH:mm'
          timeFormat = "24hr"
          DatePicker = { DatePickerDialog }
          TimePicker = { TimePickerDialog }
          fullWidth = { true }
          errorText = { props.error.eventStart || props.error.eventEnd }
        />
      </div>
    :null }
      </div>
  </MuiThemeProvider>
  );}
  export default eventStarts;