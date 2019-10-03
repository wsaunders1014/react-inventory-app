import React from 'react';
import './ProgressBar.css';
import checkmark from './img/checkmark.svg';
class ProgressBar extends React.Component {
  render(){
    return(
      <div id="progress-bar" className="clearfix">
        <div className="step active"><div className="select-bg"></div><span>SELECT CATEGORIES</span><img src={checkmark} alt=" checkmark"/></div>
        <div className="step two"><div className="select-bg"></div><span>LARGE ITEMS</span><img src={checkmark} alt=" checkmark"/></div>
        <div className="step two"><div className="select-bg"></div><span>ADD BOXES</span><img src={checkmark} alt=" checkmark"/></div>
        <div className="step three"><div className="select-bg"></div><span>REVIEW INVENTORY</span><img src={checkmark} alt=" checkmark"/></div>
        <div className="step"><div className="select-bg"></div><span>COMPLETED</span><img src={checkmark} alt=" checkmark"/></div>
      </div>
    );
  }
}


export default ProgressBar;
