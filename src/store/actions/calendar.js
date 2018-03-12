import axios from 'axios';
import * as config from '../../config';

/**
*  Select current calendar by id
* @param {string} id - calendar id 
*/
export const selectCalendar = ( id ) => {
  return {
    type: "SELECT_CALENDAR",
    payload: id
  }
}


/**
* Save calendars id to store
* @param {Array} calendarsId -- Array of calendar`s id
* @param {string} token - user token for google api
*/
const createCalendarsList = ( calendarsId, token ) => {
  return {
    type: "CREATE_CALENDARS_LIST",
    payload: calendarsId,
    token: token
  }
}

const setAvailableRoom = ( timeToEvent ) => {
  return {
    type: "SET_AVAILABLE_ROOM",
    payload: {
      status: 'Available',
      timeStart: '',
      eventName:'',
      description:'',
      timeEnd:'',
      BtnName:'Quick book for now!',
      timeToNextEvent: timeToEvent
   }
  }
}

const setReservedRoom = ( timeToEvent ) =>{
  return {
    type: "SET_RESERVED_ROOM",
    payload: {
      status:'Reserved',
      timeStart: '',
      BtnName: 'Quick check-in',
      eventName:'',
      description:'',
      timeEnd:'',
      timeToNextEvent: timeToEvent
    }
  }
}

const setBusyRoom = ( event, timeStart, timeEnd ) =>{
  return {
    type: "SET_BUSY_ROOM",
    payload: {
      status: 'Busy',
      eventName: event.name,
      description: event.description,
      timeStart: timeStart,
      timeEnd:  timeEnd,
      BtnName: 'View'
    },
  }
}


const saveCalendarEvents = ( events ) => {
  return {
    type: "LOAD_CALENDAR_EVENTS",
    payload: events
  }
}

const saveCalendar = calendar => {
  return {
    type: "SAVE_CALENDAR",
    payload: calendar
  }
}
const saveEvent = event => {
  return{
    type: "SAVE_EVENT",
    payload: event
  }
}

const loadCalendarsFromGoogle = (access_token) =>{
  return dispatch => {
    axios.get( `https://www.googleapis.com/calendar/v3/users/me/calendarList?access_token=${ access_token }` )
    .then(res => {
      res = res.data.items;
      let calendars = [];
      res.forEach(element => {
        if (element.accessRole === "owner")
        calendars.push({
          id: element.id,
          name: element.summary
        });
      });
      dispatch( createCalendarsList( calendars, access_token ));
    })
    .catch( error => {
      console.log(error.message)
    });
}
}

export const loadCalendarApi = () => {//should rewrite for cordova
  return dispatch => {
    const script = document.createElement( "script" );
    script.src = "https://apis.google.com/js/api.js";
    document.body.appendChild (script );
    script.onload = () => {
      window.gapi.load('client:auth2', () => dispatch( initClient() ) );
    };
    
  }
}


const initClient = () => {//should rewrite for cordova
  return dispatch => {
    window.gapi.client.init( {
      apiKey: config.API_KEY,
      clientId: config.CLIENT_ID,
      discoveryDocs: config.DISCOVERY_DOCS,
      scope: config.SCOPES
    })
    .then( function () {
      window.gapi.auth2.getAuthInstance()
      .signIn()
      .then( function (arg) {
        let access_token = arg.Zi.access_token;
        dispatch( loadCalendarsFromGoogle(access_token ));
      },
      function( error ) { 
        if ( error ) alert( 'please allow popup for this app' )
      });
    });
  }
}

 
/**
 * Load current event from store and update room status
 * @param {object} event first event from list 
 */
export const loadCurrentEvent = ( event ) => {
  return dispatch => {
    let currentTime = new Date().valueOf();
    if( !event ) {
      dispatch( setAvailableRoom( " - " ) );
    }
    else{
      let timeToEvent = Date.parse( event.start ) - currentTime;
      
      if( Date.parse( event.start ) > currentTime ) {
        if(  timeToEvent > 15 * 60 * 1000 ) {
          dispatch( setAvailableRoom( timeToEvent ) );
        }
        else{
          dispatch( setReservedRoom( timeToEvent ) );
        }
      }
      else{
          let timeStart = Date.parse( event.start );
          let timeEnd = Date.parse( event.end );
          dispatch( setBusyRoom( event, timeStart, timeEnd ) );
        }
    }  
    }
}

/**
* Load future events for special calendar
* @param {string} calendarId - id of google calendar
* @param {string} access_token - user token for google api
*/
export const loadEvents = ( calendarId, access_token ) => {
  return dispatch => {
    axios.get(`https://www.googleapis.com/calendar/v3/calendars/${ calendarId }/events?access_token=${ access_token }`)
    .then(res => {
      res = res.data;
      let calendarEvents = [];
      let curDate = new Date();
      
      res.items.forEach(e => { //events
        let endDatetime = Date.parse(e.end.dateTime);
        if( endDatetime > curDate ){
          let event = {
            name: e.summary,
            id: e.id,
            start: e.start.dateTime,
            end: e.end.dateTime,
            description: e.description
          }
          calendarEvents.push( event );
        }
      });
      calendarEvents.sort( ( a, b ) => Date.parse( a.start ) - Date.parse( b.start ) );
      dispatch( saveCalendarEvents( calendarEvents ) );
    });
  }
}

/**
*  Create a new google Calendar
* @param {string} calendarName - name of new Calendar
* @param {string} access_token -user token for google api
*/
export const createCalendar = ( calendarName, access_token ) => {
  let data = {
    "summary": calendarName
  },
  headers = {
    headers: {
      'Authorization': 'Bearer ' + access_token,
    }
  }
  return dispatch => {
    axios.post(`https://www.googleapis.com/calendar/v3/calendars`, data, headers)
    .then(res => {
      dispatch( saveCalendar( {
        id: res.data.id,
        name: res.data.summary
      })
    );
    })
  }
}

/**
* add event to google calendar 
* @param {object} event -- describe event for calendar
*  event={
  *   start:"",
  *   end:"",
  *   summary: "",
  *   description: ""
  *  }
  *  @param {string} calendarId - google calendar id
  *  @param {string} access_token - user token for google api
  */
  export const createEvent = ( event,calendarId, access_token ) => {
    let data = {
      "start": {
        "dateTime": event.start.format(),
        "timeZone": "Europe/Kiev"
      },
      "end": {
        "dateTime": event.end.format(),
        "timeZone": "Europe/Kiev"
      },
      "description": event.description,
      "summary": event.summary || ""
    },
    headers={
      headers: {
        'Authorization':'Bearer ' + access_token,
      }
    }
    return dispatch => {
      axios.post(`https://www.googleapis.com/calendar/v3/calendars/${ calendarId }/events`, data,headers )
      .then( res => {
          let event={
            id: res.data.id,
            description: res.data.description,
            name: res.data.summary,
            start: res.data.start.dateTime,
            end: res.data.end.dateTime
          }
        dispatch( saveEvent( event ) );
      })
    }
    
  }