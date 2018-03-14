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
              if( events.length === 0 ){
                events.push(action.payload);
              }
              else {
                let eventDate = Date.parse(action.payload.end);
                let index = -1;
                for( let i=0; i< events.length; i++){
                  let eDate = Date.parse( events[i].end );
                  if( eventDate > eDate ){
                    index = i;
                  } 
                }
                if( index !== -1 ) {
                  events.splice( index + 1, 0, {...action.payload });
                }
                else events.push( {...action.payload});
                
              }
              return {
                ...state,
                currentCalendarEvents: events
              }    
            }
        case 'DELETE_EVENT':
          {
            let events = [ ...state.currentCalendarEvents ];
            let index = events.findIndex(item => item.id === action.payload );
            if( index !== -1 ) events.splice( index, 1);
              return {
                ...state,
                currentCalendarEvents: events
              }
          }
        default:
            return state
    }
}
