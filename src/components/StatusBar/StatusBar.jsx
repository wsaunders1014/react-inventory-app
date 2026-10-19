import React from 'react';
import {useSelector} from 'react-redux';
import {selectTotals} from '../../features/inventory/inventorySlice.js';

function StatusBar(props){
  const stats = useSelector(selectTotals)
  return(
    <div className="status-bar">
      <div id="item-weight">APPROX WEIGHT: <span className="bolded">{stats.lbs} lbs.</span></div>
      <div id="item-vol">APPROX VOL.: <span className="bolded">{stats.cf} CF</span></div>
    </div>
  )
}
export default StatusBar;
