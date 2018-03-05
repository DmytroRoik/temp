import {combineReducers} from 'redux';
import calendar from './calendar';
import UI from './UI';

const allReducers=combineReducers({
 calendar,
 UI,
});

export default allReducers;