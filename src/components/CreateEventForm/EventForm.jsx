import React from 'react';
import classes from './EventForm.css';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog'
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import  moment  from 'moment';
/**
 * Use: <EventForm stage="" clickedBack={} clickedNext={} inputedValue={}/>
 * Props:
 *  - stage {number} - 1: display description and event name, 2: display event time
 *  
 */
const eventForm=(props)=>{

  let stageForm=null;

  if( props.stage == "1" ) {
    stageForm = (
      <div>
        <div>
          <label 
            htmlFor="eventNameInput" >
            Event name:
          </ label >
          < input 
            type ="text" 
            id = "eventNameInput"
            placeholder = "Enter event name"
            onInput = { props.inputedValue }
            />
          { props.error.summary ?
            <div className = { classes.error } > { props.error.summary } </div>
          : null
          }
        </div>

        <label 
          htmlFor = "eventDescriptionInput" >
          Event description:
        </label>
        <input 
          type = "text" 
          id = "eventDescriptionInput"
          placeholder = "author or extra info(optional)"
          onInput = {props.inputedValue} />

        <button onClick = {props.clickedBack} > Cancel </button>
        <button onClick = {props.clickedNext}> Next </button>
      </div>
    );
  }
  else if( props.stage == "2" ) {
    stageForm=(
      <div>
         <DateTimePicker 
          returnMomentDate = { true }
          onChange = { (dateTime) => props.changeDateTime( "event-start", dateTime ) }
          id = "event-start"
          floatingLabelText = "Event start"
          DatePicker = { DatePickerDialog }
          TimePicker = { TimePickerDialog }
          errorText = { props.error.eventEnd }
        />
           < DateTimePicker 
            returnMomentDate = { true }
            onChange = { (dateTime) => props.changeDateTime( "event-end", dateTime ) }
            id = "event-end"
            floatingLabelText = "Event end"
            DatePicker = { DatePickerDialog }
            TimePicker = { TimePickerDialog }
            errorText = { props.error.eventEnd }
        />
        <button onClick = { props.clickedBack } > Back </button>
        <button onClick ={ props.clickedNext } > Create </button>
      </div>
    );
    }
  return(
    <MuiThemeProvider>
      <div className={classes.EventForm}>

        { ( props.error.conflictEvents || [] ).length > 0 ?
          <div>
            <h3>Conflicts:</h3>
            <ol>
              { ( props.error.conflictEvents || []).map( ev => {
                  return <li key = { ev.id } >
                      { ev.name } <br/>
                      <span> start: {" " + moment( ev.start ).format('lll') } </span>
                      <span> end: {" " + moment( ev.end ).format('lll')  } </span>
                    </li>
              })}
            </ol>
          </div>
        :null
        }
        {stageForm}
      </div>
  </MuiThemeProvider>
);
}
export default eventForm;