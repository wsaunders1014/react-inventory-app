import React from 'react';
import {useSelector} from 'react-redux';
import {categoriesById} from '../catalog/catalog.js';
import {selectInventoryEntries, selectTotals} from './inventorySlice.js';
import QuantityControl from './QuantityControl.jsx';
import MoveDetailsForm from '../moves/MoveDetailsForm.jsx';
import Icon, {categoryIcons} from '../../shared/ui/Icon.jsx';
import {formatNumber} from '../moves/Dashboard.jsx';
export default function ReviewStep({onExport, onPrint, onAddItems, onBoxes}) {
  const entries = useSelector(selectInventoryEntries);
  const totals = useSelector(selectTotals);
  const groups = Object.groupBy(entries, item => item.categoryId);
  return <>
    <div className="step-intro"><span className="eyebrow">STEP 04 · ONE LAST LOOK</span><h2>Everything accounted for.</h2><p>A little clarity before the big day. Check your list, add the details, and you’re ready.</p></div>
    <div className="review-stat-grid"><div><Icon name="grid"/><strong>{formatNumber(totals.count)}</strong><span>Total items</span></div><div><Icon name="box"/><strong>{formatNumber(totals.cf)}<small>cu ft</small></strong><span>Est. volume</span></div><div><Icon name="weight"/><strong>{formatNumber(totals.lbs)}<small>lb</small></strong><span>Est. weight</span></div></div>
    <section className="review-section"><div className="review-section-heading"><h3>The details of your move</h3><span>Saved as you go</span></div><MoveDetailsForm/></section>
    <section className="review-section"><div className="review-section-heading"><h3>Your inventory<span className="count-tag">{totals.count}</span></h3><div className="review-edit-actions"><button className="text-button" onClick={onAddItems}><Icon name="plus" size={15}/>Items</button><button className="text-button" onClick={onBoxes}><Icon name="plus" size={15}/>Boxes</button></div></div>
      {entries.length ? Object.entries(groups).map(([id, group]) => <div key={id} className="review-category"><h4><Icon name={categoryIcons[id]} size={18}/>{categoriesById[id].name}<span>{group.reduce((count, item) => count + item.quantity, 0)} items</span></h4>
        <div className="review-table-heading"><span>Item</span><span>Est. volume</span><span>Quantity</span></div>
        {group.map(item => <div key={item.id} className="review-row"><div><strong>{item.name}</strong><span>{item.size || (item.id.startsWith('custom-') ? 'Custom item' : categoriesById[item.categoryId].name)}</span></div><span className="review-volume">{formatNumber(item.cf * item.quantity)} cu ft</span><QuantityControl item={item} compact/></div>)}
      </div>) : <div className="catalog-empty"><Icon name="box" size={32}/><h3>Your list is a blank canvas.</h3><p>Add at least one item or box before completing your inventory.</p><button className="button secondary" onClick={onAddItems}>Browse furniture<Icon name="arrow" size={16}/></button></div>}
    </section>
    <div className="review-export"><div><Icon name="file" size={25}/><div><h3>Take your list with you.</h3><p>Download a spreadsheet or print a copy for moving day.</p></div></div><div className="export-buttons"><button className="button secondary" onClick={() => onExport('csv')} disabled={!entries.length}><Icon name="download" size={16}/>CSV</button><button className="button secondary" onClick={onPrint} disabled={!entries.length}><Icon name="print" size={16}/>Print / PDF</button></div></div>
    <p className="estimate-disclaimer">Volumes and weights are estimates for planning, not a moving quote. Confirm final measurements and pricing with your mover.</p>
  </>;
}
