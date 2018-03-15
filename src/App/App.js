import React, { Component } from 'react';
import CalendarList from '../containers/Calendars/CalendarsList.jsx';
import { connect } from 'react-redux';
import { loadCalendarApi } from '../store/actions/calendar';
import RoomManager from '../containers/RoomManager/RoomManager.jsx';
import EventBuilder from '../containers/EventBuilder/EventBuilder.jsx';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

class App extends Component {
  static propTypes = {
    eventBuilderShow: PropTypes.bool,
    calendarListShow: PropTypes.bool,
    loadCalendars: PropTypes.func
  };

  render() {
    return ( 
      <BrowserRouter>
        <Switch>
          <Route path="/calendarList" exact component={ CalendarList } />
          <Route path="/" component={ RoomManager } />
          <Route path="/new-event" exact component={ EventBuilder } />
        </Switch>
      </BrowserRouter>
    );
  }
  componentDidMount() {
    this.props.loadCalendars();
  }
}
const mapStateToProp = state => {
  return {
    calendarListShow: state.UI.calendarListShow,
    eventBuilderShow: state.UI.eventBuilderShow
  };
};

const mapDispatchToProp = dispatch => {
  return {
    loadCalendars: () => dispatch( loadCalendarApi() )
  };
};

export default connect( mapStateToProp, mapDispatchToProp )( App );
