import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import './Item.css';
import {addItem,removeItem,updateCF,updateLBS} from '../../redux/actions.js';
import {spaceRemove} from '../../util/helpers.js';
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

  let isOwned = categoryInfo.itemKeys.indexOf(props.name);

  let howManyOwned = categoryInfo.itemCount[isOwned] || 0;

  const dispatch = useDispatch();
  function handleAddItem(e){
    e.stopPropagation();
    dispatch(addItem(props.category,props));
    dispatch(updateCF(props.cf))
    dispatch(updateLBS(props.lbs))
  }
  function handleRemoveItem(e){
    e.stopPropagation();
    dispatch(removeItem(props.category,props))
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

export default Item;
