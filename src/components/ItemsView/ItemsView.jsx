import React from 'react';
import {useSelector} from 'react-redux';
import Item from '../Item';
import './ItemsView.css';
import SearchBar from '.././SearchBar';
import {spaceRemove} from '../../util/helpers.js';
//import {addItem,removeItem,updateCF,updateLBS} from '../../redux/actions.js';
function ItemsView(props){

  //Grab the categories object from the store. We will be adding items to its subarray
  const categories = useSelector(state => state.categories);
  const stats = useSelector(state => state.stats);

  let selectedCategories = getListOfSelectedCats(categories);
  ///let [currentCat,setCurrentCat] = useState(0);
  let catKey = selectedCategories[props.currentCat];
//  let array = createArrayOfItemsForCategory(selectedCategories[currentCat],props.itemList);

  return(
    <div id="items" className="main">
      <div className="heading cancelSelect"><span>{selectedCategories[props.currentCat]}</span>
        <SearchBar />
      </div>
      <div className="overflow">
        <div id="items-holder" className="holder">
          {
            //console.log(props.itemList[catKey])
           Object.keys(props.itemList[catKey]).map((currVal,index)=>{
              return <Subcategory key={currVal} subcat={currVal} category={catKey} items={props.itemList[catKey][currVal]}/>
           })
          }
        </div>
      </div>
      <div className="status-bar">
        <div id="item-weight">APPROX WEIGHT: <span className="bolded">{stats.lbs} lbs.</span></div>
        <div id="item-vol">APPROX VOL.: <span className="bolded">{stats.cf} CF</span></div>
        {/* Hide Next button if there's only one selected category */ }
        {selectedCategories.length >1 && props.currentCat < selectedCategories.length-1 &&
          <div className="next" >Next Category: <span id="next-cat" onClick={()=>{props.setCurrentCat(props.currentCat+ 1)}}> {selectedCategories[props.currentCat+1]} ></span></div>
        }
      </div>
    </div>
  )
}
//Iterates through array and loads the selected categories into array.
function getListOfSelectedCats(categories){
  let array = [];
//  console.log(categories['Sofas & Couches'].isSelected)
  for (let key in categories) {
    if(categories[key].isSelected)
      array.push(key);
  }
  return array;
}


function Subcategory(props){
  return(
    <div className="sub-cat" id={"subcat-"+props.subcat}>
      <div className="sub-heading">{props.subcat.split('_').join(' ')}</div>
      <div className="items-container clearfix">
          {
            Object.keys(props.items).map((currVal,index)=>{
              let item = props.items[currVal];
              return <Item key={spaceRemove(currVal)} category={props.category} {...item} />
            })
          }
      </div>
    </div>
  )
}
export default ItemsView;



// TODO: Need to add children to menu for items.
