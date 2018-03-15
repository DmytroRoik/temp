/* global localStorage */
import React, { Component } from 'react';
import CalendarList from '../containers/Calendars/CalendarsList.jsx';
import { connect } from 'react-redux';
import { loadCalendarApi } from '../store/actions/calendar';
import RoomManager from '../containers/RoomManager/RoomManager.jsx';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

class App extends Component {
  static propTypes = {
    loadCalendars: PropTypes.func
  };

  render() {
    let routes;
    if ( localStorage.getItem( 'calendarId' ) ) {
      routes = 
      <Switch>
        <Route path = "/" component = { RoomManager } />
      </Switch>;
    } else {
      routes =
      <Switch>
        <Route path = "/" exact component = { CalendarList } />
        <Route path = "/roomManager" exact component = { RoomManager } />
      </Switch>;
    }
    return ( 
      <BrowserRouter>
        { routes }
      </BrowserRouter>
    );
  }
  componentDidMount() {
    this.props.loadCalendars(); 
  }
}

const mapStateToProps = state => {
  return {
    calendarId: state.calendar.currentCalendar  
  };
};

const mapDispatchToProp = dispatch => {
  return {
    loadCalendars: () => dispatch( loadCalendarApi() )
  };
};

export default connect( null, mapDispatchToProp )( App );
