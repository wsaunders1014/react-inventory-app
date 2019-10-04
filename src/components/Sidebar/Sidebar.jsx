import React from 'react';
import './Sidebar.css';
import { connect } from 'react-redux';
import {deselectCategory,changeCanProgress} from '../../redux/actions.js';
function Sidebar(props) {
  const handleDeselectCategory =(e)=>{
    let target = e.target;
    let key = target.getAttribute('catid');
    /* Set parent class name (from: animate-in) to animate-out and then wait for animation to complete before dispatching */
    target.parentElement.className = 'animate-out';
    setTimeout(()=>{
      props.dispatch(deselectCategory(key))
      //Check if any categories are selected, if not, dispatch changeCanProgress(false)
      let anySelected = false;
      Object.keys(props.categories).reduce((selected=false,currVal)=>{
        if(props.categories[currVal].isSelected===true)
          anySelected = true;
        return selected
      });

      if(!anySelected){
        props.dispatch(changeCanProgress(false));
      }
    },500);

  }
  console.log('props', props)
    return(
      <div id="sidebar" className="sidebar">
        <div className="wrapper">
          <div className="heading cancelSelect">Your Categories</div>
          <div className="overflow">
            <div id="ul-holder" className="holder">
              <ul>

                {  /* Check category isSelected, if false, shows up in Categories instead.*/ }
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
