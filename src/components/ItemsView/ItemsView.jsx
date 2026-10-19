import React from 'react';
import { useSelector } from 'react-redux';
import { items, categoriesById } from '../../features/catalog/catalog.js';
import { selectActiveCategoryId } from '../../features/inventory/inventorySlice.js';
import Item from '../Item/Item.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';
import './ItemsView.css';
export default function ItemsView() {
  const id = useSelector(selectActiveCategoryId);
  const groups = Object.groupBy(items.filter(item => item.categoryId === id && !item.isChild), item => item.subcategory);
  return <>
    <div className="heading cancelSelect"><span>{categoriesById[id]?.name || 'Choose a category or search for an item.'}</span><SearchBar /></div>
    <div className="holder">{Object.entries(groups).map(([name, group]) => <div className="sub-cat" key={name}>
      {name && <div className="sub-heading">{name.replaceAll('_', ' ')}</div>}
      <div className="items-container clearfix">{group.map(item => <Item key={item.id} {...item} />)}</div>
    </div>)}</div>
  </>;
}
