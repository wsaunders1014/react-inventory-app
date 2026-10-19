import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { categoriesById } from '../../features/catalog/catalog.js';
import { categoryDeselected, activeCategoryChanged, selectSelectedCategoryIds, selectActiveCategoryId, selectCategoryCounts, selectTotals } from '../../features/inventory/inventorySlice.js';
import './Sidebar.css';
export default function Sidebar(props) {
  const selected = useSelector(selectSelectedCategoryIds);
  const active = useSelector(selectActiveCategoryId);
  const counts = useSelector(selectCategoryCounts);
  const totals = useSelector(selectTotals);
  const dispatch = useDispatch();
  return <div ref={props.ref} id={props.id} className={'sidebar ' + props.classes}>
    <div className="wrapper">
      <div className="heading cancelSelect">Your Categories</div>
      <div className="overflow"><div id="ul-holder" className="holder"><ul>
        {selected.map(id => <li key={id} className={'animate-in' + (active === id && props.step === 'items' ? ' current' : '')} onClick={() => dispatch(activeCategoryChanged(id))}>
          <div className="cat">{categoriesById[id].name}</div>
          <div className="close-btn" onClick={event => {event.stopPropagation(); dispatch(categoryDeselected(id));}}>+</div>
          <div className="number">{counts[id] || 0}</div>
        </li>)}
      </ul></div></div>
      <div className="status-bar"><span>TOTAL ITEMS:</span><span id="total-items" className="bolded">{totals.count}</span></div>
    </div><div className="back-btn" />
  </div>;
}
