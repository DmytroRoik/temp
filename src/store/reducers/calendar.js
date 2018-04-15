/* global localStorage */
const initialState = {
  allCalendars: [],
  currentCalendar: localStorage.getItem( 'calendarId' ) || '',
  currentCalendarEvents: JSON.parse( localStorage.getItem( 'Events' ) ) || [],
  people:[],
  
  loading: false,
  access_token: '',
  settingsVisibility: false,
  calendarListShow: !!localStorage.getItem( 'calendarId' ), 
  room: {
    status: 'Available',
    timeStart: '',
    eventName: '',
    description: '',
    timeEnd: '',
    BtnName: 'Quick book for now!',
    timeToNextEvent: ' - '
  }
};

export default function calendar( state = initialState, action ) {
  switch ( action.type ) {
    case 'SELECT_CALENDAR':
    {
      localStorage.setItem( 'calendarId', action.payload );
      return {
        ...state,
        currentCalendar: action.payload
      };
    }
    case 'SAVE_CALENDAR':
    {
      const calendars = [...state.allCalendars];
      calendars.push( action.payload );
      return {
        ...state,
        allCalendars: [...calendars]
      };
    }
    case 'CREATE_CALENDARS_LIST':
    { 
      return {
        ...state,
        allCalendars: [...action.payload],
        access_token: action.token,
        loading: false
      };
    }
    case 'SET_AVAILABLE_ROOM':
    {
      return {
        ...state,
        room: { ...action.payload }
      };
    }
    case 'SET_RESERVED_ROOM':
    {
      return {
        ...state,
        room: { ...action.payload }
      };
    }
    case 'SET_BUSY_ROOM':
    {
      return {
        ...state,
        room: { ...action.payload }
      };
    }
    case 'SHOW_SPINNER':
    {
      return {
        ...state,
        loading: action.payload
      }
    }
    case 'SHOW_SETTINGS':
    {
      return {
        ...state,
        settingsVisibility: action.payload
      }
    }
    case 'REFRESH_APP':
    {
      return{
        ...state,
        access_token: '',
        settingsVisibility: false,
        calendarListShow: true,
        currentCalendar: '',
        currentCalendarEvents: []
      }
    }
    case 'TOGGLE_CALENDAR_LIST':
    {
      return {
        ...state,
        calendarListShow: action.payload
      }
    }
    case 'LOAD_CALENDAR_EVENTS':
    {
      localStorage.setItem( 'Events', JSON.stringify( action.payload ) );
      return {
        ...state,
        currentCalendarEvents: [...action.payload]   
      };
    }
    case 'SAVE_EVENT':
    {
      const events = [...state.currentCalendarEvents];
      const eventDate = Date.parse( action.payload.end );
      let index = events.findIndex( e => eventDate < Date.parse( e.end ) );

       if ( index !== -1 ) {
          events.splice( index, 0, { ...action.payload } );
        } else {
          events.push( { ...action.payload } );
        }
      return {
        ...state,
        currentCalendarEvents: events
      };    
    }
    case 'DELETE_EVENT':
    {
      const events = [...state.currentCalendarEvents];
      const index = events.findIndex( item => item.id === action.payload );
      if ( index !== -1 ) {
        events.splice( index, 1 );
      }
      return {
        ...state,
        currentCalendarEvents: events
      };
    }
    case 'SAVE_USERS_ID':
    {
      return {
        ...state,
        people: [...action.payload]
      }
    }
    default:
      return state;
  }
}
