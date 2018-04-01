import React,{Component} from 'react';
import './Settings.css';
import * as config from '../../config';
import {login,showSettings,refreshApp} from '../../store/actions/calendar';
import refreshBg from '../../images/refresh.png';
import { connect } from 'react-redux';
import RekognizeForm from '../../components/RekognizeRegistry/RekognizeRegistry';
class Settings extends Component{
  constructor(props){
    super(props);
    this.state = {
      showRekognizeForm: false
    }
    this.rekognitionDate = {

    }
  }
  onRefreshBtnClickHandler = () => {
    localStorage.clear();
    sessionStorage.clear();
    this.props.refreshApp();
  }
  onBtnAddUserClickHandler = () => {
    this.setState((prevState,prevProps)=>{
      return {
        showRekognizeForm: !prevState.showRekognizeForm
      }
    });
  }

  //Rekognize Form
  onAddBtnClickHandler = e => {
    this.rekognitionDate = {
      name: e.target.rekognizeName.value,
      email: e.target.rekognizeEmail.value
    }
    e.preventDefault();
    e.stopPropagation();
    this.setState({showRekognizeForm: false});
  }
  onMakePhotoClickHandler = e => {
    e.preventDefault();
    e.stopPropagation();
  }

  render(){
    if(!this.props.show) return null;
    return (
      <div className="Settings">
        <h3>Settings</h3>
        <div className="Settings-content">
          <h2>{config.PROGRAM_NAME}</h2>
          <div className="version">{`version: ${config.VERSION}`}</div>
          <hr/>
          <p className="Settings-title">Erase all data && Refresh</p>
          <button className="btn-refresh" style={{backgroundImage: `url(${refreshBg})`}} onClick={this.onRefreshBtnClickHandler}>Reset</button>
          <div className="rekognize-section">
            <label className="Settings-title">Rekognize:</label>
            <button className="btn-rekognize" onClick={this.onBtnAddUserClickHandler}>Add User</button>
            <button className="btn-rekognize">Reset users</button>
          </div>
          <RekognizeForm 
            show ={this.state.showRekognizeForm} 
            onAdd={this.onAddBtnClickHandler}
            onMakePhoto={this.onMakePhotoClickHandler}/>
        </div>
          <button className="btn-close" onClick={() =>this.props.toggleSettings(false)}>Close</button>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    toggleSettings: show => dispatch( showSettings(show) ),
    login: () => dispatch(login()),
    refreshApp: () => dispatch(refreshApp())//
  };
};
export default connect( null, mapDispatchToProps )( Settings );