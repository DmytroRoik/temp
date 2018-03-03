const initialState = {
    allCalendarsId: [],

    currentCalendarId: '',
    currentCalendarEvents: [],
    calendar: '1488'
}

export default function calendar(state = initialState, action) {
    switch (action.type) {
        case 'SELECT_CALENDAR':
            {
                return {
                    ...state,
                    currentCalendarId: action.payload
                }
            }
        case 'CREATE_CALENDARS_LIST':
            {
                return {
                    ...state,
                    allCalendarsId: [...action.payload]
                }
            }

        default:
            return state
    }
}