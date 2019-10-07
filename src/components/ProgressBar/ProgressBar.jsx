import React from 'react';
import './ProgressBar.css';
import checkmark from './img/checkmark.svg';

function ProgressBar(props) {
    const pages = ['Select Categories','Large Items','Add Boxes','Review Inventory','Completed'];
    return(
      <div id="progress-bar" className="clearfix">
        {
           pages.map((currVal,index)=>{
             let className = "step";
             if(props.pageIndex === index)
              className = "step active";
             else if(props.pageIndex > index)
              className = "step completed"
             return (<div className={className} key={currVal}><div className="select-bg"></div><span>{pages[index]}</span><img src={checkmark} alt=" checkmark"/></div>)
           })
        }
      </div>
    )
}



export default ProgressBar;
