import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import './Item.css';
import {itemAdded,itemRemoved} from '../../features/inventory/inventorySlice.js';
import {imageFor} from '../../features/catalog/catalog.js';
function Item(props){
  let size = (!props.size) ? "":props.size;
  const image = imageFor(props);

  const howManyOwned = useSelector(state => state.inventory.quantities[props.id] || 0);
  const dispatch = useDispatch();
  function handleAddItem(e) { e.stopPropagation(); dispatch(itemAdded(props.id)); }
  function handleRemoveItem(e) { e.stopPropagation(); dispatch(itemRemoved(props.id)); }
  return(
    <div className={(howManyOwned > 0) ? "item owned":"item"} id={props.id} onClick={handleAddItem}>
      <div className="img" style={{background:"url(img/items/"+image.toLowerCase()+") no-repeat 50%"}} id={props.name}>
        <div className="number">{(howManyOwned > 0) ? howManyOwned:''}</div>
      </div>
      <div className="bottom">
        <h4 className="cancelSelect">{(props.hasChildren) ? props.name:(size+' '+props.name)}</h4>
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
