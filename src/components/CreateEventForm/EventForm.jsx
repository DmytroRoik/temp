/* global alert */
import React from 'react';
import moment from 'moment';

import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import PropTypes from 'prop-types';
import './EventForm.css';


/**
 * Use: <EventForm stage="" clickedBack={} clickedNext={} inputedValue={} error={}/>
 * @param {object} props contains all attr for component:
 *  - stage {number} - 1: display description and event name, 2: display event time
 *  @returns {component} stateless Component
 */
const eventForm = props => {
  let stageForm = null;

  if ( props.stage === '1' ) {
    stageForm = (
      <div>
        <div className = "inputFileds" >
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
            <div className = "error" > { props.error.summary } </div>
            : null
          }
        </div>
        <div className = "inputFileds">
          <label
            htmlFor = "eventDescriptionInput" >
            Event description:
          </label>
          <input
            type = "text"
            id = "eventDescriptionInput"
            placeholder = "author or extra info"
            onInput = { props.inputedValue } />
        </div>
        <button
          onClick = {props.clickedBack} 
          className = "btn btn-Prev"
        > Cancel </button>
        <button
          onClick = { props.clickedNext }
          className = "btn btn-Next"
        > Next </button>
      </div>
    );
  } else if ( props.stage === '2' ) {
    stageForm = (
      <div className = "inputFileds" >
        <DateTimePicker
          returnMomentDate = { true }
          onChange = { dateTime => props.changeDateTime( 'event-start', dateTime ) }
          id = "event-start"
          floatingLabelText = "Event start"
          DatePicker = { DatePickerDialog }
          TimePicker = { TimePickerDialog }
          errorText = { props.error.eventStart || props.error.eventEnd }
        />
        < DateTimePicker 
          returnMomentDate = { true }
          onChange = { dateTime => props.changeDateTime( 'event-end', dateTime ) }
          id = "event-end"
          floatingLabelText = "Event end"
          DatePicker = { DatePickerDialog }
          TimePicker = { TimePickerDialog }
          errorText = { props.error.eventEnd }
        />
        <div className = "buttons" >
          <button
            onClick = { props.clickedBack } 
            className = "btn btn-Prev"
          > Back </button>
          <button
            onClick = { props.clickedNext } 
            className = "btn btn-Next"
          > Create </button>
        </div>
      </div>
    );
  }
  return (
    <MuiThemeProvider>
      <div className = "EventForm" >

        { ( props.error.conflictEvents || [] ).length > 0 ?
          <div className = "conflicts" >
            <h3>Conflicts:</h3>
            <ol className = "conflicts-container" >
              { ( props.error.conflictEvents || [] ).map( ev => {
                return ( <li 
                  className = "conflicts-item"
                  key = { ev.id } >
                  <span className = "conflicts-item-name" >{ ev.name } </span>
                  <br/>
                  <span className = "conflicts-item-time"> start: { `${moment( ev.start ).format( 'lll' )}` } </span>
                  <span className = "conflicts-item-time"> end: {` ${moment( ev.end ).format( 'lll' )}` } </span>
                </li> );
              } )}
            </ol>
          </div>
          : null
        }
        {stageForm}
      </div>
    </MuiThemeProvider>
  );
};

eventForm.propTypes = {
  stage: PropTypes.string,
  error: PropTypes.object,
  changeDateTime: PropTypes.func,
  clickedBack: PropTypes.func.isRequired,
  clickedNext: PropTypes.func.isRequired,
  inputedValue: PropTypes.func.isRequired
};

export default eventForm;


