import React from 'react';
import classes from './EventForm.css';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog'
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
/**
 * Use: <EventForm stage="" clickedBack={} clickedNext={} inputedValue={}/>
 * Props:
 *  - stage {number} - 1: display description and event name, 2: display event time
 *  
 */
const eventForm=(props)=>{
  let ComponentFormAttribute={};

  if(props.stage=="1"){
    ComponentFormAttribute={
      inputFirst:{
        labelText:'Event name:',
        id:'eventNameInput',
        type:'text',
        placeholder: 'Enter event name',
        value:''
      },
      inputSecond:{
        labelText:'Event description:',
        id:'eventDescriptionInput',
        type:'text',
        placeholder: 'author or extra info(optional)',
        value:''
      },
      BtnNextText:'Next',
      BtnPrevText:'Cancel'
    }
  }
  else if(props.stage=="2"){
    ComponentFormAttribute={
      inputFirst:{
        labelText:'Event start:',
        id:'eventStartInput',
        type:'datatime',
        placeholder: '',
        value:''
      },
      inputSecond:{
        labelText:'Event end:',
        id:'eventEndInput',
        type:'datatime',
        placeholder: '',
        value:''
      },
      BtnNextText:'Create',
      BtnPrevText:'Back'
      
    }
  }
  return(
    <MuiThemeProvider>
  <div className={classes.EventForm}>
    <label 
      htmlFor={ComponentFormAttribute.inputFirst.id}>
      {ComponentFormAttribute.inputFirst.labelText}
    </label>
    <input 
      type={ComponentFormAttribute.inputFirst.type} 
      id={ ComponentFormAttribute.inputFirst.id }
      placeholder={ComponentFormAttribute.inputFirst.placeholder }
      onInput={props.inputedValue}
      />

    <label 
      htmlFor={ComponentFormAttribute.inputSecond.id}>
      {ComponentFormAttribute.inputSecond.labelText}
    </label>
    <input 
      type={ComponentFormAttribute.inputSecond.type} 
      id={ ComponentFormAttribute.inputSecond.id }
      placeholder={ComponentFormAttribute.inputSecond.placeholder }
      onInput={props.inputedValue} />
       <DateTimePicker 
        returnMomentDate={true}
        onChange={(datetime)=>{
          debugger;
        }}
        id="event-start"
        floatingLabelText="Get my date"
        DatePicker={DatePickerDialog}
        TimePicker={TimePickerDialog}
        textFieldClassName='datetime-input event-start'
      />

    <button onClick={props.clickedBack}>{ComponentFormAttribute.BtnPrevText}</button>
    <button onClick={props.clickedNext}>{ComponentFormAttribute.BtnNextText}</button>
  </div>
  </MuiThemeProvider>
);}
export default eventForm;