/* global localStorage */
import React, { Component } from 'react';
import CalendarList from '../containers/Calendars/CalendarsList.jsx';
import { connect } from 'react-redux';
import { loadCalendarApi } from '../store/actions/calendar';
import RoomManager from '../containers/RoomManager/RoomManager.jsx';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Spinner from '../components/UI/Spinner/Spinner';

class App extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      calendarListShow: false
    };
  }
  static propTypes = {
    loadCalendars: PropTypes.func
  };

  toggleCalendarListVisibility = isShow => {
    this.setState( { calendarListShow: isShow } );
  }
  render() {
    return ( 
      <div>
        <Spinner show = { this.props.isLoading }/>
        { this.state.calendarListShow ?
          <CalendarList clicked = { this.toggleCalendarListVisibility } /> : 
          <RoomManager/> }
      </div>
    );
  }
  componentDidMount() {
    this.props.loadCalendars();

    if ( this.props.calendarId ) {
      this.toggleCalendarListVisibility( false );
    } else {
      this.toggleCalendarListVisibility( true );
    }
  }
}

const mapStateToProps = state => {
  return {
    calendarId: state.calendar.currentCalendar,
    isLoading: state.calendar.loading
  };
};

const mapDispatchToProp = dispatch => {
  return {
    loadCalendars: () => dispatch( loadCalendarApi() )
  };
};

export default connect( mapStateToProps, mapDispatchToProp )( App );
