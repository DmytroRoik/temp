/* global localStorage */
import React, { Component } from 'react';
import CalendarList from '../containers/Calendars/CalendarsList.jsx';
import RoomManager from '../containers/RoomManager/RoomManager.jsx';
import Spinner from '../components/UI/Spinner/Spinner';

import { login, toggleCalendarList } from '../store/actions/calendar';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';


class App extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      calendarListShow: !this.props.calendarId
    };
  }
  static propTypes = {
    loadCalendars: PropTypes.func
  };

  render() {
    return ( 
      <div>
        <Spinner show = { this.props.isLoading }/>
        { this.props.calendarListShow ?
          <CalendarList clicked = { this.props.toggleCalendarListVisibility } /> : 
          <RoomManager/> }
      </div>
    );
  }
  componentDidMount() {
    this.props.loadCalendars();

    if ( this.props.calendarId ) {
      this.props.toggleCalendarListVisibility( false );
    } else {
      this.props.toggleCalendarListVisibility( true );
    }
  }
}

const mapStateToProps = state => {
  return {
    calendarId: state.calendar.currentCalendar,
    isLoading: state.calendar.loading,
    calendarListShow: state.calendar.calendarListShow
  };
};

const mapDispatchToProp = dispatch => {
  return {
    loadCalendars: () => dispatch( login() ),
    toggleCalendarListVisibility: show => dispatch(toggleCalendarList(show))
  };
};

export default connect( mapStateToProps, mapDispatchToProp )( App );
