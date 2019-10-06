import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import './Items.css';
import SearchBar from '.././SearchBar';
import {spaceRemove} from '../../util/helpers.js';
import {addItem,removeItem,updateCF,updateLBS} from '../../redux/actions.js';
function Items(props){

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

  const categoryInfo = useSelector(state => state.categories[props.category])
  let isOwned = categoryInfo.items.indexOf(props.name);
  //console.log(categoryInfo)
  let howManyOwned = 0 || categoryInfo.itemCount[isOwned];
  const dispatch = useDispatch();
  function handleAddItem(e){
    e.stopPropagation();
    dispatch(addItem(props.category,props.name));
    dispatch(updateCF(props.cf))
    dispatch(updateLBS(props.lbs))
  }
  function handleRemoveItem(e){
    e.stopPropagation();
    dispatch(removeItem(props.category,props.name))
    if(howManyOwned>0){
      dispatch(updateCF(-props.cf))
      dispatch(updateLBS(-props.lbs))
    }
  }
  return(
    <div className={(isOwned !== -1) ? "item owned":"item"} id={props.id} onClick={handleAddItem}>
      <div className="img" style={{background:"url(img/items/"+image.toLowerCase()+") no-repeat 50%"}} id={props.name}>
        <div className="number">{(howManyOwned > 0) ? howManyOwned:''}</div>
      </div>
      <div className="bottom">
        <h4 className="cancelSelect">{(props.hasChildren.length>0) ? props.name:(size+' '+props.name)}</h4>
        <div className="controls clearfix">
          <div className="minus" onClick={handleRemoveItem}>&ndash;</div>
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


// TODO: Need to add children to menu for items.
