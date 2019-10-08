import React from 'react';
import {useSelector} from 'react-redux';

function StatusBar(props){
  const stats = useSelector(state => state.stats)
  return(
    <div className="status-bar">
      <div id="item-weight">APPROX WEIGHT: <span className="bolded">{stats.lbs} lbs.</span></div>
      <div id="item-vol">APPROX VOL.: <span className="bolded">{stats.cf} CF</span></div>
      {/* Hide Next button if there's only one selected category */ }
      {/* props.selectedCategories.length > 1 && props.currentCat < props.selectedCategories.length-1 &&
        <div className="next" >Next Category: <span id="next-cat" onClick={()=>{props.setCurrentCat(props.currentCat+ 1)}}> {props.selectedCategories[props.currentCat+1]} ></span></div>
    */  }
    </div>
  )
}
export default StatusBar;
