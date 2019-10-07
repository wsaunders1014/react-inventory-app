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
  //Totals up number of items in category
  const getCatTotal = (key, obj) =>{
    let total = obj[key].itemCount.reduce((total,num)=>{
      return total + num;
    },0);
    return total;
  }
  const getAllTotal = (categoriesObj) =>{

    return Object.keys(categoriesObj).reduce((total,currVal)=>{
      //Only count selected categories, otherwise if they deselect a category the total won't reflect actual number
      return (categoriesObj[currVal].isSelected) ? total += getCatTotal(currVal,categoriesObj):total;
    },0)

  }
    return(
      <div id={props.id} className={"sidebar "+props.classes}>
        <div className="wrapper">
          <div className="heading cancelSelect">Your Categories</div>
          <div className="overflow">
            <div id="ul-holder" className="holder">
              <ul>

                {  /* Check category isSelected, if false, shows up in Categories instead.*/ }
                {Object.keys(props.categories).map((currVal,index)=>{
                  if(props.categories[currVal].isSelected===true){
                    return (
                      <li className={props.currentCat===index && props.pageIndex>0  ? " animate-in current":"animate-in"} key={currVal} onClick={()=>{props.setCurrentCat(index)}}>
                        <div className="cat">{currVal}</div>
                        <div className="close-btn" catid={currVal} onClick={handleDeselectCategory}>+</div>
                        <div className="number">{getCatTotal(currVal,props.categories)}</div>
                      </li>
                    )
                  }else{
                    return false;
                  }
                })}
              </ul>
            </div>
          </div>
          <div className="status-bar">
            <span>TOTAL ITEMS:</span><span id="total-items" className="bolded">{getAllTotal(props.categories)}</span>
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
