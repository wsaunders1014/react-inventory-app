import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { categories } from '../../features/catalog/catalog.js';
import { categorySelected, selectSelectedCategoryIds } from '../../features/inventory/inventorySlice.js';
import './Categories.css';
export default function Categories() {
  const selected = useSelector(selectSelectedCategoryIds);
  const dispatch = useDispatch();
  return <>
    <div className="heading cancelSelect"><span>Please <span className="bold">select</span> the categories that apply to your move.</span></div>
    <div className="holder">{categories.map((category, index) => category.id !== 'boxes' && !selected.includes(category.id) &&
      <div key={category.id} className="item animate-in" onClick={() => dispatch(categorySelected(category.id))}>
        <div className="img" style={{backgroundPosition: `${-133 * (index % 4)}px ${-133 * Math.floor(index / 4)}px`}} />
        <div className="bottom"><h4 className="cancelSelect">{category.name}</h4></div>
      </div>)}</div>
  </>;
}
