import {itemsById, categoriesById} from '../features/catalog/catalog.js';
import {recordFromState} from './moveRepository.js';
export const entriesForRecord = record => Object.entries(record.inventory.quantities).flatMap(([id, quantity]) => {
  const item = itemsById[id] || record.inventory.customItems?.[id];
  return item ? [{...item, quantity}] : [];
});
export const totalsForRecord = record => entriesForRecord(record).reduce((totals, item) => ({count: totals.count + item.quantity, boxes: totals.boxes + (item.categoryId === 'boxes' ? item.quantity : 0), cf: totals.cf + item.cf * item.quantity, lbs: totals.lbs + item.lbs * item.quantity}), {count: 0, boxes: 0, cf: 0, lbs: 0});
const safeFilename = title => (title || 'inventory').replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s+/g, '-').slice(0, 80) || 'inventory';
function download(content, name, type) {
  const url = URL.createObjectURL(new Blob([content], {type}));
  const link = document.createElement('a');
  link.href = url; link.download = name; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export const exportJSON = state => {
  const record = recordFromState(state);
  download(JSON.stringify(record, null, 2), `${safeFilename(record.move.title)}.json`, 'application/json');
};
// Prefix spreadsheet formulas even inside quoted cells to avoid formula execution.
const csvCell = value => '"' + String(value ?? '').replace(/^[=+@\-\t\r]/, match => "'" + match).replaceAll('"', '""') + '"';
export function buildCSV(record) {
  const rows = [['Category', 'Item', 'Size', 'Quantity', 'Volume (cu ft) each', 'Weight (lb) each', 'Total volume (cu ft)', 'Total weight (lb)']];
  for (const item of entriesForRecord(record)) rows.push([categoriesById[item.categoryId]?.name || item.categoryId, item.name, item.size, item.quantity, item.cf, item.lbs, item.cf * item.quantity, item.lbs * item.quantity]);
  const totals = totalsForRecord(record);
  rows.push(['TOTAL', '', '', totals.count, '', '', totals.cf, totals.lbs]);
  return '\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n');
}
export const exportCSV = state => {
  const record = recordFromState(state);
  download(buildCSV(record), `${safeFilename(record.move.title)}.csv`, 'text/csv;charset=utf-8');
};
