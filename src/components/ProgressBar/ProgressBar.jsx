import React from 'react';
import './ProgressBar.css';
import checkmark from './img/checkmark.svg';
import {useSelector} from 'react-redux';
function ProgressBar(props) {
    let pages = useSelector(state=>state.pageIndex);
    return(
      <div id="progress-bar" className="clearfix">
        {
           pages.pages.map((currVal,index)=>{
             return (<div className={(index===pages.pageIndex) ? "step active":"step"} key={currVal}><div className="select-bg"></div><span>{pages.pages[index]}</span><img src={checkmark} alt=" checkmark"/></div>)
           })
        }
      </div>
    )
}



export default ProgressBar;
