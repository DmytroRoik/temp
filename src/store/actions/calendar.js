/* global window document alert */
import axios from 'axios';
import * as config from '../../config';
import store from '../store'

/**
*  Select current calendar by id
* @param {string} id - calendar id 
* @returns { action } dispatch action
*/
export const selectCalendar = id => {
  return {
    type: 'SELECT_CALENDAR',
    payload: id
  };
};

const deleteEventFromStore = id => {
  return {
    type: 'DELETE_EVENT',
    payload: id
  };
};

/**
* Save calendars id to store
* @param {Array} calendarsId -- Array of calendar`s id
* @param {string} token - user token for google api
* @returns { action } dispatch action
*/
const createCalendarsList = ( calendarsId, token) => {
  return {
    type: 'CREATE_CALENDARS_LIST',
    payload: calendarsId,
    token: token
  };
};

export const toggleCalendarList = show => {
  return {
    type: 'TOGGLE_CALENDAR_LIST',
    payload: show
  }
}
export const refreshApp = () => {
  return dispatch => {
    dispatch({type:'REFRESH_APP'});
    dispatch(setAvailableRoom());
    dispatch(login());
  }
}

const setAvailableRoom = timeToEvent => {
  return {
    type: 'SET_AVAILABLE_ROOM',
    payload: {
      status: 'Available',
      timeStart: '',
      eventName: '',
      description: '',
      timeEnd: '',
      BtnName: 'Quick book for now!',
      timeToNextEvent: timeToEvent||' - '
    }
  };
};

const setReservedRoom = timeToEvent => {
  return {
    type: 'SET_RESERVED_ROOM',
    payload: {
      status: 'Reserved',
      timeStart: '',
      BtnName: 'Quick check-in',
      eventName: '',
      description: '',
      timeEnd: '',
      timeToNextEvent: timeToEvent
    }
  };
};

const setBusyRoom = ( event, timeStart, timeEnd ) => {
  return {
    type: 'SET_BUSY_ROOM',
    payload: {
      status: 'Busy',
      eventName: event.name,
      description: event.description,
      timeStart: timeStart,
      timeEnd: timeEnd,
      BtnName: 'View'
    }
  };
};


const saveCalendarEvents = events => {
  return {
    type: 'LOAD_CALENDAR_EVENTS',
    payload: events
  };
};

const showSpinner = show => {
  return {
    type: "SHOW_SPINNER",
    payload: show
  };
};
export const showSettings = show => {
  return {
    type: "SHOW_SETTINGS",
    payload: show
  };
};
const saveCalendar = calendar => {
  return {
    type: 'SAVE_CALENDAR',
    payload: calendar
  };
};
const saveEvent = event => {
  return {
    type: 'SAVE_EVENT',
    payload: event
  };
};

const saveUsersTOStoreFromDB = users => {
  return {
    type: 'SAVE_USERS_ID',
    payload: users
  }
}

const loadCalendarsFromGoogle = access_token => {
  return dispatch => {
    dispatch( showSpinner( true ) );
    axios.get( `https://www.googleapis.com/calendar/v3/users/me/calendarList?access_token=${access_token}` )
      .then( res => {
        res = res.data.items;
        const calendars = [];

        res.forEach( element => {
          if ( true ) {//element.accessRole === 'owner'
            calendars.push( {
              id: element.id,
              name: element.summary
            } );
          }
        } );
        dispatch( createCalendarsList( calendars, access_token ) );
      } )
      .catch( () => dispatch( showSpinner( false ) ) );
  };
};

const initClient = () => {// should rewrite for cordova
  return dispatch => {
    window.gapi.client.init( {
      apiKey: config.API_KEY,
      clientId: config.CLIENT_ID,
      discoveryDocs: config.DISCOVERY_DOCS,
      scope: config.SCOPES
    } )
      .then( () => {
        window.gapi.auth2.getAuthInstance()
          .signIn()
          .then( arg => {
            const access_token = arg.Zi.access_token;
            dispatch( loadCalendarsFromGoogle( access_token ) );
          },
          error => { 
            if ( error ) { 
              alert( 'please allow popup for this app' );
            }
          } );
      } );
  };
};

export const login = () => {// should rewrite for cordova
  return dispatch => {
    const script = document.createElement( 'script' );
    script.src = 'https://apis.google.com/js/api.js';
    document.body.appendChild( script );
    script.onload = () => {
      window.gapi.load( 'client:auth2', () => dispatch( initClient() ) );
    };
    dispatch(readUsersFromDb())
  };
};

 
/**
 * Load current event from store and update room status
 * @param {object} event first event from list 
 * @returns { action } dispatch action
 */
export const loadCurrentEvent = event => {
  return dispatch => {
    const currentTime = new Date().valueOf();
    if ( !event ) {  
      dispatch( setAvailableRoom( ' - ' ) );
    } else if ( Date.parse( event.end ) < currentTime ) {
      dispatch( deleteEventFromStore( event.id ) );
    } else {
      const timeToEvent = Date.parse( event.start ) - currentTime;
      
      if ( Date.parse( event.start ) > currentTime ) {
        if ( timeToEvent > 15 * 60 * 1000 ) {
          dispatch( setAvailableRoom( timeToEvent ) );
        } else {
          dispatch( setReservedRoom( timeToEvent ) );
        }
      } else {
        const timeStart = Date.parse( event.start );
        const timeEnd = Date.parse( event.end );
        dispatch( setBusyRoom( event, timeStart, timeEnd ) );
      }
    }  
  };
};

/** 
 * @param {[]} attList - array of people emails
 *  
*/
const writeAttendee = ( attList, eventId ) => {
  const attArr = [];
  return dispatch => {
    attList.forEach( a => {
      if(a.responseStatus === 'accepted' && !a.self){
       const user = store.getState().calendar.people.filter(p=> p.email === a.email)[0];

       console.log(store.getState().calendar)
       // loadUserAvatar(a.email);
        const attendee = {
          name: a.email.split('@')[0].replace('.', ' '),
          img: ''
        }
       // console.log(attendee);
      } ''
      
    })
  }
  

}

export const loadUserAvatar = userID => {
  axios.get(`https://people.googleapis.com/v1/people/${userID}?personFields=photos&key=${config.API_KEY}`)
  .then(response=>{
    const imgUrl = response.data.photos[0].url || '';
    console.log(imgUrl)})
  .catch(err=>console.log(err));
}

export const saveUserToDB = (userID, email) => {
  axios.post('https://roommanager-44c77.firebaseio.com/users.json',{
    email,
    userID
  })
  .then(response=>console.log(response))
  .catch(err=>console.log(err));
}
export const readUsersFromDb = () => {
  return dispatch => {
    axios.get('https://roommanager-44c77.firebaseio.com/users.json')
    .then(response=>{
      const users = [];
      for(let key in response.data){
        const user = response.data[key]
        users.push(user);
      }
      dispatch(saveUsersTOStoreFromDB(users));
    })
    .catch(err=>console.log(err));
  }
}

/**
* Load future events for special calendar
* @param {string} calendarId - id of google calendar
* @param {string} access_token - user token for google api
* @returns { action } dispatch action
*/
export const loadEvents = ( calendarId, access_token ) => {
  return dispatch => {
    axios.get( `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?access_token=${access_token}` )
      .then( res => { //get events from google
        const result = res.data;
        const calendarEvents = [];
        const curDate = new Date();
        result.items.forEach( e => { // events
          if(e.end){
            console.log(e.end)
            const endDatetime = Date.parse( e.end.dateTime );
            if ( endDatetime > curDate ) {
              const event = {
                name: e.summary,
                id: e.id,
                start: e.start.dateTime,
                end: e.end.dateTime,
                description: e.description,
                attendees: [...e.attendees.filter(a => a.responseStatus === 'accepted' && !a.self)]
              };
              calendarEvents.push( event );
            }
          }

        } );
        calendarEvents.sort( ( a, b ) => Date.parse( a.start ) - Date.parse( b.start ) );
        return calendarEvents;
      })
      .then(events => { //load attendees image url for first event
        if(events.length > 0){
          events[0].attendees.forEach(a => {
            const user = store.getState().calendar.people.filter(u=> u.email === a.email)[0];
            if(user){
              axios.get(`https://people.googleapis.com/v1/people/${user.userID}?personFields=photos&key=${config.API_KEY}`)
              .then(response => {
                const imgUrl = response.data.photos ? response.data.photos[0].url : '';
                a.name = a.email.split('@')[0].replace('.', ' '),
                a.img = imgUrl;
              });
            }
          });
          dispatch( saveCalendarEvents( events ) );
          console.log(store.getState().calendar)
        }
      });
  };
};

/**
*  Create a new google Calendar
* @param {string} calendarName - name of new Calendar
* @param {string} access_token -user token for google api
* @returns { action } dispatch action
*/
export const createCalendar = ( calendarName, access_token ) => {
  const data = {
      summary: calendarName
    },
    headers = {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    };
  return dispatch => {
    axios.post( 'https://www.googleapis.com/calendar/v3/calendars', data, headers )
      .then( res => {
        dispatch( saveCalendar( {
          id: res.data.id,
          name: res.data.summary
        } )
        );
      } );
  };
};

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
  *  @returns { action } dispatch action
  */
export const createEvent = ( event, calendarId, access_token ) => {
  const data = {
      start: {
        dateTime: event.start.format(),
        timeZone: 'Europe/Kiev'
      },
      end: {
        dateTime: event.end.format(),
        timeZone: 'Europe/Kiev'
      },
      description: event.description,
      summary: event.summary || ''
    },
    headers = {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    };
  return dispatch => {
    saveUserToDB('105144585756498708876', 'dmytroroik@gmail.com');
    axios.post( `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, data, headers )
      .then( res => {
        const newEvent = {
          id: res.data.id,
          description: res.data.description,
          name: res.data.summary,
          start: res.data.start.dateTime,
          end: res.data.end.dateTime
        };
       
        dispatch( saveEvent( newEvent ) );
      } );
  };
};
