import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectSelectedCategoryIds, selectCategoryCounts, selectTotals, selectActiveCategoryId, activeCategoryChanged, categoryDeselected} from './inventorySlice.js';
import {categoriesById} from '../catalog/catalog.js';
import Icon, {categoryIcons} from '../../shared/ui/Icon.jsx';
import {formatNumber} from '../moves/Dashboard.jsx';
import {goToStep, selectStep} from '../wizard/wizardSlice.js';
export default function InventorySummary({onConfirm, onCategories, onExport}) {
  const ids = useSelector(selectSelectedCategoryIds);
  const counts = useSelector(selectCategoryCounts);
  const totals = useSelector(selectTotals);
  const active = useSelector(selectActiveCategoryId);
  const step = useSelector(selectStep);
  const dispatch = useDispatch();
  const choose = id => {if (id === 'boxes') dispatch(goToStep('boxes')); else {dispatch(activeCategoryChanged(id)); dispatch(goToStep('items'));}};
  const remove = id => {
    if (counts[id]) onConfirm({title: `Remove ${categoriesById[id].name}?`, message: `This also removes the ${counts[id]} items in this category from your inventory.`, action: 'Remove category', onConfirm: () => dispatch(categoryDeselected(id))});
    else dispatch(categoryDeselected(id));
  };
  return <aside className="inventory-summary" aria-label="Inventory summary">
    <div className="summary-heading"><span className="summary-symbol"><Icon name="box" size={20}/></span><div><h3>Your moving list</h3><span>A little more together.</span></div></div>
    <div className="summary-total"><strong>{formatNumber(totals.count)}</strong><span>{totals.count === 1 ? 'item' : 'items'} coming with you</span></div>
    <div className="summary-categories">{ids.length ? ids.map(id => <div key={id} className={'summary-category' + ((step === 'items' && active === id) || (step === 'boxes' && id === 'boxes') ? ' active' : '')}>
      <button className="summary-category-name" type="button" onClick={() => choose(id)}><Icon name={categoryIcons[id]} size={16}/><span>{categoriesById[id].name}</span><strong>{counts[id] || 0}</strong></button>
      <button className="summary-remove" type="button" aria-label={`Remove ${categoriesById[id].name} category`} onClick={() => remove(id)}><Icon name="close" size={13}/></button>
    </div>) : <p className="summary-empty">Your list starts here. Choose a category or add a box to make a little room.</p>}
      <button className="summary-add" onClick={onCategories}><Icon name="plus" size={14}/>Edit categories</button>
    </div>
    <dl className="summary-measurements"><div><dt><Icon name="box" size={15}/>Est. volume</dt><dd>{formatNumber(totals.cf)} <span>cu ft</span></dd></div><div><dt><Icon name="weight" size={15}/>Est. weight</dt><dd>{formatNumber(totals.lbs)} <span>lb</span></dd></div><div><dt><Icon name="grid" size={15}/>Boxes included</dt><dd>{totals.boxes}</dd></div></dl>
    <p className="summary-note"><Icon name="info" size={13}/>A helpful estimate, not a final quote.</p>
    <button className="button subtle full" onClick={() => onExport('json')}><Icon name="download" size={16}/>Download a backup</button>
    <div className="summary-reassurance"><Icon name="shield" size={16}/><p>Made a little progress?<br/><strong>We save it as you go.</strong></p></div>
  </aside>;
}
