import React, { Component } from 'react';
import CalendarList from '../containers/Calendars/CalendarsList.jsx';
import { connect } from 'react-redux';
import { loadCalendarApi } from '../store/actions/calendar';
import RoomManager from '../containers/RoomManager/RoomManager.jsx';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

class App extends Component {
  static propTypes = {
    loadCalendars: PropTypes.func
  };

  render() {
    return ( 
      <BrowserRouter>
        <Switch>
          <Route path = "/" exact component = { CalendarList } />
          <Route path = "/roomManager" component = { RoomManager } />
          <Redirect to = "/roomManager" />      
        </Switch>
      </BrowserRouter>
    );
  }
  componentDidMount() {
    this.props.loadCalendars();
  }
}

const mapDispatchToProp = dispatch => {
  return {
    loadCalendars: () => dispatch( loadCalendarApi() )
  };
};

export default connect( null, mapDispatchToProp )( App );
