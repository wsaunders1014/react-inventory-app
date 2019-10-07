/*
Sidebar needs to be refactored to display either version because they both share so much, but I just want to get through the main flow first.

*/

import React from 'react';
import './Boxes-Sidebar.css';
import { useSelector} from 'react-redux';
import {deselectCategory,changeCanProgress} from '../../redux/actions.js';
function Sidebar(props) {
  console.log(props);
  const boxesCategory = useSelector(state=>state.categories['Boxes'])
  // const handleDeselectCategory =(e)=>{
  //   let target = e.target;
  //   let key = target.getAttribute('catid');
  //   /* Set parent class name (from: animate-in) to animate-out and then wait for animation to complete before dispatching */
  //   target.parentElement.className = 'animate-out';
  //   setTimeout(()=>{
  //     props.dispatch(deselectCategory(key))
  //     //Check if any categories are selected, if not, dispatch changeCanProgress(false)
  //     let anySelected = false;
  //     Object.keys(props.categories).reduce((selected=false,currVal)=>{
  //       if(props.categories[currVal].isSelected===true)
  //         anySelected = true;
  //       return selected
  //     });
  //
  //     if(!anySelected){
  //       props.dispatch(changeCanProgress(false));
  //     }
  //   },500);
  //
  // }
  //Totals up number of items in category
  const getCatTotal = (key, obj) =>{
    let total = obj[key].itemCount.reduce((total,num)=>{
      return total + num;
    },0);
    return total;
  }

    return(
      <div id="boxes-sidebar" className="sidebar animate-in">
        <div className="wrapper">
          <div className="heading cancelSelect">Added Boxes</div>
          <div className="overflow">
            <div id="ul-holder" className="holder">
              <ul>


                { boxesCategory.itemObj.map((currVal,index)=>{

                    return (
                      <li className="animate-in" key={currVal.name}>
                        <div className="cat">{currVal.name}</div>
                        {/*<div className="close-btn" catid={currVal} >+</div> */}
                        <div className="number">{boxesCategory.itemCount[index]}</div>
                      </li>
                    )

                })
              }
              </ul>
            </div>
          </div>

        </div>

      </div>
    )
}
function mapStateToProps(state){
  return {
    boxes:state.categories['Boxes'],
  }
}
export default Sidebar;
