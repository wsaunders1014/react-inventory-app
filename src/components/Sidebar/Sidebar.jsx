import React from 'react';
import './Sidebar.css';
import { connect } from 'react-redux';
import {deselectCategory} from '../../redux/actions.js';
function Sidebar(props) {
  const handleDeselectCategory =(e)=>{
    let key = e.target.getAttribute('catid');
    props.dispatch(deselectCategory(key))
  }
  console.log('props', props)
    return(
      <div id="sidebar" className="sidebar">
        <div className="wrapper">
          <div className="heading cancelSelect">Your Categories</div>
          <div className="overflow">
            <div id="ul-holder" className="holder">
              <ul>
                {Object.keys(props.categories).map((currVal)=>{
                  if(props.categories[currVal].isSelected===true){
                    return (
                      <li className="animate-in"  key={currVal}>
                        <div className="cat">{currVal}</div>
                        <div className="close-btn" catid={currVal} onClick={handleDeselectCategory}>+</div>
                        <div className="number">0</div>
                      </li>
                    )
                  }else{
                    return false;
                  }
                })}
              </ul>
            </div>
          </div>
          <div className="status-bar" style={{bottom: "-47px"}}>
            <span>TOTAL ITEMS:</span><span id="total-items" className="bolded">0</span>
          </div>
        </div>
        <div className="back-btn"></div>
      </div>
    )
}
function mapStateToProps(state){
  return {
    categories:state.categories,
  }
}
export default connect(mapStateToProps)(Sidebar);
