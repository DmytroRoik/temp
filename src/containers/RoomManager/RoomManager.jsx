import React,{Component} from 'react';
import classes from './RoomManager.css';
import RoomStatus from '../../components/RoomStatusWidget/RoomStatus';

class RoomManager extends Component{
  render(){
    return (
      <div className={classes.RoomManager}>
      Room Status
        {/* <RoomStatus status="" eventName="" timeToEventStart="" timeToEventEnd="" description="" currentTime="" clicked={''}/> */}
      </div>
    );
  }
}
export default RoomManager;