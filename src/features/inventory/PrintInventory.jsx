import React from 'react';
import {useSelector} from 'react-redux';
import {selectInventoryEntries, selectTotals} from './inventorySlice.js';
import {categoriesById} from '../catalog/catalog.js';
import {displayDate, formatNumber} from '../moves/Dashboard.jsx';
export default function PrintInventory() {
  const move = useSelector(state => state.move);
  const entries = useSelector(selectInventoryEntries);
  const totals = useSelector(selectTotals);
  return <article className="print-inventory">
    <header><strong>roomby<span> · MOVING INVENTORY</span></strong><p>Prepared {displayDate(new Date().toISOString())}</p></header>
    <h1>{move.title || 'My next chapter'}</h1>
    <div className="print-details">{move.from && <p><strong>From:</strong> {move.from}</p>}{move.to && <p><strong>To:</strong> {move.to}</p>}{move.movingDate && <p><strong>Moving date:</strong> {displayDate(move.movingDate)}</p>}</div>
    <p className="print-totals">{totals.count} items · {formatNumber(totals.cf)} cu ft estimated volume · {formatNumber(totals.lbs)} lb estimated weight</p>
    <table><thead><tr><th>Item</th><th>Category</th><th>Qty</th><th>Vol. (cu ft)</th><th>Weight (lb)</th><th>Packed</th></tr></thead><tbody>{entries.map(item => <tr key={item.id}><td>{item.name}{item.size && <small>{item.size}</small>}</td><td>{categoriesById[item.categoryId].name}</td><td>{item.quantity}</td><td>{formatNumber(item.cf * item.quantity)}</td><td>{formatNumber(item.lbs * item.quantity)}</td><td>☐</td></tr>)}</tbody><tfoot><tr><th colSpan={2}>Total</th><th>{totals.count}</th><th>{formatNumber(totals.cf)}</th><th>{formatNumber(totals.lbs)}</th><th/></tr></tfoot></table>
    {move.notes && <section className="print-notes"><h2>Moving notes</h2><p>{move.notes}</p></section>}
    <footer>Volumes and weights are planning estimates, not a moving quote. Prepared with Roomby.</footer>
  </article>;
}
