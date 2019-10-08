import React from 'react';
import './Sidebar.css';
import { useSelector,useDispatch} from 'react-redux';
import {deselectCategory,changeCanProgress,changeCurrentCategory} from '../../redux/actions.js';
function Sidebar(props) {
  let currentCategoryIndex = useSelector(state=>state.currentCategoryIndex);
  const categories = useSelector(state=>state.categories);
  const dispatch = useDispatch();
  console.log(currentCategoryIndex)

  const handleDeselectCategory =(e)=>{
    let target = e.target;
    let key = target.getAttribute('catid');
    let newArray = props.selectedCategories.slice();
    newArray.splice(props.selectedCategories.indexOf(key),1)
    props.setSelectedCategories(newArray)


    /* Set parent class name (from: animate-in) to animate-out and then wait for animation to complete before dispatching */
    target.parentElement.className = 'animate-out';
    setTimeout(()=>{
      dispatch(deselectCategory(key))
      //Check if any categories are selected, if not, dispatch changeCanProgress(false)
      let anySelected = false;
      Object.keys(categories).reduce((selected=false,currVal)=>{
        if(categories[currVal].isSelected===true)
          anySelected = true;
        return selected
      });

      if(!anySelected){
        dispatch(changeCanProgress(false));
      }
    },500);

  }
  const handleCategoryClick = (e) => {
    if(props.pageIndex ===1){
      let id = e.currentTarget.getAttribute('data-id');
      let index = props.selectedCategories.indexOf(id);

      dispatch(changeCurrentCategory(index))
    }
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
                {Object.keys(categories).map((currVal,index)=>{
                  if(categories[currVal].isSelected===true){
                    return (
                      <li data-id={currVal} className={currVal===props.selectedCategories[currentCategoryIndex] && props.pageIndex>0  ? " animate-in current":"animate-in"} key={currVal} onClick={handleCategoryClick}>
                        <div className="cat">{currVal}</div>
                        <div className="close-btn" catid={currVal} onClick={handleDeselectCategory}>+</div>
                        <div className="number">{getCatTotal(currVal,categories)}</div>
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
            <span>TOTAL ITEMS:</span><span id="total-items" className="bolded">{getAllTotal(categories)}</span>
          </div>
        </div>
        <div className="back-btn"></div>
      </div>
    )
}

//Totals up number of items in category
const getCatTotal = (key, obj) =>{
  let total = obj[key].itemCount.reduce((total,num)=>{
    return total + num;
  },0);
  return total;
}
export default Sidebar;
