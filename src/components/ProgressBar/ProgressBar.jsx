import React from 'react';
import './ProgressBar.css';
import {steps} from '../../features/wizard/wizardSlice.js';
import checkmark from './img/checkmark.svg';

function ProgressBar(props) {
    const pages = steps.map(step => step.label);
    const pageIndex = steps.findIndex(step => step.id === props.step);
    return(
      <div id="progress-bar" className="clearfix">
        {
           pages.map((currVal,index)=>{
             let className = "step";
             if(pageIndex === index)
              className = "step active";
             else if(pageIndex > index)
              className = "step completed"
             return (<div className={className} key={currVal}><div className="select-bg"></div><span>{pages[index]}</span><img src={checkmark} alt=" checkmark"/></div>)
           })
        }
      </div>
    )
}



export default ProgressBar;
