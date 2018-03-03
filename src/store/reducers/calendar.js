const initialState = {
    allCalendars: [],

    currentCalendar: '',
    currentCalendarEvents: []
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
                    allCalendars: [...action.payload]
                }
            }
        case 'LOAD_CALENDAR_EVENTS':
            {
                return {
                    ...state,
                    currentCalendarEvents: [...action.payload]
                }
            }

        default:
            return state
    }
}