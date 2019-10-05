import React,{useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import './Items.css';
import SearchBar from '.././SearchBar';
import {spaceRemove,spaceAdder} from '../../util/helpers.js';
function Items(props){
  //Grab the categories object from the store. We will be adding items to its subarray
  const categories = useSelector(state => state.categories);
  let selectedCategories = getListOfSelectedCats(categories);
  let [currentCat,setCurrentCat] = useState(0);
  let catKey = selectedCategories[currentCat];
//  let array = createArrayOfItemsForCategory(selectedCategories[currentCat],props.itemList);

  return(
    <div id="items" className="main">
      <div className="heading cancelSelect"><span>{selectedCategories[currentCat]}</span>
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
        <div id="item-weight">APPROX WEIGHT: <span className="bolded">0 lbs.</span></div>
        <div id="item-vol">APPROX VOL.: <span className="bolded">0 CF</span></div>
        {/* Hide Next button if there's only one selected category */ }
        {selectedCategories.length >1 && currentCat < selectedCategories.length &&
          <div className="next">Next Category: <span id="next-cat"> {selectedCategories[currentCat+1]} ></span></div>
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
function createArrayOfItemsForCategory(category,items){
  //console.log(category,items)
  return Object.keys(items).filter((currVal,index)=>{
    if(items[currVal].category === category)
      return items[currVal];
    else return null
  })
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

function Item(props){

  let size = (!props.size) ? "":props.size;
  let image;
  if(props.image===true) {
    image = spaceRemove(props.name)+'.png'
  }else if(props.image===false){
    image = 'coming-soon.png';
  }else{
    image = props.image;
  }
  const dispatch = useDispatch();
  function handleAddItem(){
    dispatch({type:"ADD_ITEM",payload:{item: props.name,cat:props.category}})
  }
  return(
    <div className="item" id={props.id}>
      <div className="img" style={{background:"url(img/items/"+image.toLowerCase()+") no-repeat 50%"}} id={props.name}>
        <div className="number"></div>
      </div>
      <div className="bottom">
        <h4 className="cancelSelect">{(props.hasChildren.length>0) ? props.name:(size+' '+props.name)}</h4>
        <div className="controls clearfix">
          <div className="minus">&ndash;</div>
          <div className="plus" onClick={handleAddItem}>+</div>
        </div>
      </div>
      {
      //  props.hasChildren.length > 0 ? <div className='menu'><ul></ul></div>:false
      }
    </div>
  )
}

export default Items;


/* */
