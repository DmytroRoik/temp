import axios from 'axios';
import * as config from '../../config';

/**
 *  Select current calendar by id
 * @param {string} id - calendar id 
 */
export const selectCalendar = (id) => {
    return {
        type: "SELECT_CALENDAR",
        payload: id
    }
}

/**
 * Save calendars id to store
 * @param {Array} calendarsId -- Array of calendar`s id
 */
const createCalendarsList = (calendarsId) => {
    return {
        type: "CREATE_CALENDARS_LIST",
        payload: calendarsId
    }
}

const saveCalendarEvents = (events) => {
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



export const loadCalendarApi = () => {
    return dispatch => {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        document.body.appendChild(script);
        script.onload = () => {
            window.gapi.load('client:auth2', () => dispatch(initClient()));
        };

    }
}

const initClient = () => {
    return dispatch => {
        window.gapi.client.init({
            apiKey: config.API_KEY,
            clientId: config.CLIENT_ID,
            discoveryDocs: config.DISCOVERY_DOCS,
            scope: config.SCOPES
        }).then(function() {
            window.gapi.auth2.getAuthInstance().signIn()
                .then(function(arg) {
                        let access_token = arg.Zi.access_token;
                        localStorage.setItem('access_token', access_token);
                        axios.get(`https://www.googleapis.com/calendar/v3/users/me/calendarList?access_token=${access_token}`)
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
                                dispatch(createCalendarsList(calendars));
                            })
                            .catch(error => {
                                console.log(error.message)
                            });
                    },
                    function(error) { if (error) alert('please allow popup for this app') });
        });
    }
}

export const loadEvents = (calendarId) => {
    let access_token = localStorage.getItem('access_token');
    return dispatch => {
        axios.get(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?access_token=${access_token}`)
            .then(res => {
                res = res.data;
                let calendarEvents = [];
                res.items.forEach(e => { //events
                    let event = {
                        name: e.summary,
                        id: e.id,
                        start: e.start.dateTime,
                        end: e.end.dateTime,
                        status: e.status,
                        htmlLink: e.htmlLink,
                    }
                    calendarEvents.push(event);
                });
                dispatch(saveCalendarEvents(calendarEvents));
            });
    }


}

/**
 *  Create a new google Calendar
 * @param {string} calendarName - name of new Calendar
 */
export const createCalendar = (calendarName) => {
    let data = {
            "summary": calendarName
        },
        headers = {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        }
    return dispatch => {
        axios.post(`https://www.googleapis.com/calendar/v3/calendars`, data, headers)
            .then(res => {
                dispatch(saveCalendar({
                    id: res.data.id,
                    name: res.data.summary
                }));
            })
    }

}