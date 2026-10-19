import React from 'react';
import { useSelector } from 'react-redux';
import { items } from '../../features/catalog/catalog.js';
import { selectQuantities } from '../../features/inventory/inventorySlice.js';
import './Boxes-Sidebar.css';
export default function BoxesSidebar() {
  const quantities = useSelector(selectQuantities);
  return <div id="boxes-sidebar" className="sidebar animate-in"><div className="wrapper">
    <div className="heading cancelSelect">Added Boxes</div>
    <div className="overflow"><div className="holder"><ul>
      {items.filter(item => item.categoryId === 'boxes' && quantities[item.id]).map(item =>
        <li key={item.id}><div className="cat">{item.name}</div><div className="number">{quantities[item.id]}</div></li>)}
    </ul></div></div>
  </div></div>;
}
