import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchItems, imageFor } from '../../features/catalog/catalog.js';
import { itemAdded } from '../../features/inventory/inventorySlice.js';
import './SearchBar.css';
export default function SearchBar() {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const results = searchItems(value);
  const current = results[index] || results[0];
  const dispatch = useDispatch();
  const add = item => { dispatch(itemAdded(item.id)); setValue(''); setIndex(0); setOpen(false); };
  return <div id="search-bar">
    <input id="search" type="text" placeholder="Search for Item..." autoComplete="off" value={value}
      onChange={event => {setValue(event.target.value); setIndex(0); setOpen(true);}}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
      onKeyDown={event => {
        if (event.key === 'Escape') setOpen(false);
        if (!open || !current) return;
        if (event.key === 'ArrowDown') {event.preventDefault(); setIndex(Math.min(index + 1, results.length - 1));}
        if (event.key === 'ArrowUp') {event.preventDefault(); setIndex(Math.max(0, index - 1));}
        if (event.key === 'Enter') {event.preventDefault(); add(current);}
      }} />
    {open && current && <>
      <div id="search-image" className="search" style={{backgroundImage: `url(img/items/${imageFor(current)})`}} />
      <div id="search-results" className="search"><ul>{results.map((item, i) =>
        <li key={item.id} className={current.id === item.id ? 'selected' : ''} onMouseEnter={() => setIndex(i)}
          onMouseDown={event => event.preventDefault()} onClick={() => add(item)}>{item.name}</li>)}</ul></div>
    </>}
  </div>;
}
