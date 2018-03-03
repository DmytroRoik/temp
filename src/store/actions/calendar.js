import axios from 'axios';
import * as config from '../../config';

/**
 *  Select current calendar by id
 * @param {string} id - calendar id 
 */
export const selectCalendarAction = (id) => {
    return {
        type: "SELECT_CALENDAR",
        payload: id
    }
}

/**
 * Save calendars id to store
 * @param {Array} calendarsId -- Array of calendar`s id
 */
export const createCalendarsList = (calendarsId) => {
    return {
        type: "CREATE_CALENDARS_LIST",
        payload: calendarsId
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
                                    calendars.push(element.id);
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