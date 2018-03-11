const initialState = {
    allCalendars: [],

    currentCalendar: '',
    currentCalendarEvents: [],
    access_token: '',
    room: {
      status: 'Available',
      timeStart: '',
      eventName:'',
      description:'',
      timeEnd:'',
      BtnName:'Quick book for now!',
      timeToNextEvent: ' - '
   }
    
}

export default function calendar(state = initialState, action) {
    switch (action.type) {
        case 'SELECT_CALENDAR':
            {
                return {
                    ...state,
                    currentCalendar: action.payload
                }
            }
        case 'SAVE_CALENDAR':
            {
                const calendars = [...state.allCalendars];
                calendars.push(action.payload);
                return {
                    ...state,
                    allCalendars: [...calendars]
                }
            }
        case 'CREATE_CALENDARS_LIST':
            {
                return {
                    ...state,
                    allCalendars: [...action.payload],
                    access_token: action.token
                }
            }
        case 'SET_AVAILABLE_ROOM':
            {
                return {
                    ...state,
                    room: { ...action.payload}
                }
            }
        case 'SET_RESERVED_ROOM':
            {
                return {
                    ...state,
                    room: { ...action.payload}
                }
            }
        case 'SET_BUSY_ROOM':
            {
                return {
                    ...state,
                    room: { ...action.payload}
                }
            }
        case 'LOAD_CALENDAR_EVENTS':
            {
              return {
                  ...state,
                  currentCalendarEvents: [...action.payload]   
              }
            }
        case 'SAVE_EVENT':
            {
              let events = [...state.currentCalendarEvents];

              let eventDateFirstEvent = Date.parse( events[0].end.dateTime );
              let eventDate = Date.parse(action.payload.end.dateTime);

              if( eventDate > eventDateFirstEvent){
                events.push(action.payload);
              }
              else{
                events.splice( 0, 0, action.payload );
              }
              return {
                ...state,
                currentCalendarEvents: events
              }    
            }

        default:
            return state
    }
}
