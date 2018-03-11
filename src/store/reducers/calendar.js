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
              return{
                  ...state,
                  currentCalendarEvents: [...action.payload]   
              }
            }

        default:
            return state
    }
}