import React from 'react';
import './Boxes.css';
import { items } from '../../features/catalog/catalog.js';
import Item from '../Item/Item.jsx';
// Prototype only: wizard navigation intentionally does not expose boxes yet.
export default function Boxes() {
  return <div id="boxes" className="main animate-in">
    <div className="heading cancelSelect">Please select the boxes that apply to your move.</div>
    <div className="overflow"><div id="main-holder" className="holder clearfix">
      {items.filter(item => item.categoryId === 'boxes' && !item.isChild).map(item => <Item key={item.id} {...item} />)}
    </div></div>
  </div>;
}
