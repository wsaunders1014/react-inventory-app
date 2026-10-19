import {categoriesById, itemsById} from '../features/catalog/catalog.js';
import {emptyInventory, MAX_QUANTITY} from '../features/inventory/inventorySlice.js';
import {emptyMove} from '../features/moves/moveSlice.js';
import {stepIds} from '../features/wizard/wizardSlice.js';
import {readJSON, writeJSON, removeStored, newId} from './storage.js';
const VERSION = 1;
const keyFor = owner => `roomby.moves.v${VERSION}.${owner || 'guest'}`;
const boundedText = (value, max = 120) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) ? value : '';
export function sanitizeInventory(value = {}) {
  const clean = emptyInventory();
  if (!value || typeof value !== 'object') return clean;
  for (const [id, item] of Object.entries(value.customItems || {}).slice(0, 500)) {
    if (!/^custom-[\w-]+$/.test(id) || !item || typeof item !== 'object' || !boundedText(item.name, 100) || !Object.hasOwn(categoriesById, item.categoryId)) continue;
    if (![item.cf, item.lbs].every(number => Number.isFinite(number) && number >= 0 && number <= 100000)) continue;
    clean.customItems[id] = {id, name: boundedText(item.name, 100), categoryId: item.categoryId, cf: item.cf, lbs: item.lbs, subcategory: 'Your items', size: '', image: false, isChild: false, hasChildren: false};
  }
  const ids = Array.isArray(value.selectedCategoryIds) ? value.selectedCategoryIds : [];
  clean.selectedCategoryIds = [...new Set(ids.filter(id => typeof id === 'string' && Object.hasOwn(categoriesById, id)))];
  for (const [id, quantity] of Object.entries(value.quantities || {}).slice(0, 2000)) {
    const item = Object.hasOwn(itemsById, id) ? itemsById[id] : Object.hasOwn(clean.customItems, id) ? clean.customItems[id] : null;
    if (!item || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) continue;
    clean.quantities[id] = quantity;
    if (!clean.selectedCategoryIds.includes(item.categoryId)) clean.selectedCategoryIds.push(item.categoryId);
  }
  clean.activeCategoryId = value.activeCategoryId !== 'boxes' && clean.selectedCategoryIds.includes(value.activeCategoryId) ? value.activeCategoryId : clean.selectedCategoryIds.find(id => id !== 'boxes') || null;
  return clean;
}
export function sanitizeRecord(value) {
  if (!value || value.version !== VERSION || typeof value.move !== 'object' || !value.inventory) throw new Error('This file is not a supported Roomby inventory. Choose a JSON backup exported from this app.');
  const now = new Date().toISOString();
  const move = {...emptyMove(), id: typeof value.move.id === 'string' && /^[\w-]{1,100}$/.test(value.move.id) ? value.move.id : newId(), title: boundedText(value.move.title) || 'My next chapter', from: boundedText(value.move.from), to: boundedText(value.move.to), movingDate: validDate(value.move.movingDate), notes: boundedText(value.move.notes, 2000), createdAt: now, updatedAt: now};
  for (const field of ['createdAt', 'updatedAt', 'completedAt']) {
    if (typeof value.move[field] === 'string' && !Number.isNaN(Date.parse(value.move[field]))) move[field] = new Date(value.move[field]).toISOString();
  }
  const step = stepIds.includes(value.wizard?.step) ? value.wizard.step : 'categories';
  const furthestStep = Number.isInteger(value.wizard?.furthestStep) ? Math.max(stepIds.indexOf(step), Math.min(stepIds.length - 1, value.wizard.furthestStep)) : stepIds.indexOf(step);
  return {version: VERSION, move, inventory: sanitizeInventory(value.inventory), wizard: {step, furthestStep}};
}
export function createMove(title = 'My next chapter') {
  const now = new Date().toISOString();
  return {version: VERSION, move: {...emptyMove(), id: newId(), title: boundedText(title) || 'My next chapter', createdAt: now, updatedAt: now}, inventory: emptyInventory(), wizard: {step: 'categories', furthestStep: 0}};
}
export function recordFromState(state) {
  return {version: VERSION, move: {...state.move, updatedAt: new Date().toISOString()}, inventory: state.inventory, wizard: state.wizard};
}
export const moveRepository = {
  list(owner) {
    const data = readJSON(keyFor(owner), {version: VERSION, records: []});
    if (data?.version !== VERSION || !Array.isArray(data.records)) return [];
    return data.records.flatMap(record => {try {return [sanitizeRecord(record)];} catch {return [];}}).sort((a, b) => b.move.updatedAt.localeCompare(a.move.updatedAt));
  },
  save(owner, record) {
    const clean = sanitizeRecord(record);
    const records = this.list(owner).filter(entry => entry.move.id !== clean.move.id);
    writeJSON(keyFor(owner), {version: VERSION, records: [clean, ...records]});
    return clean;
  },
  remove(owner, id) {writeJSON(keyFor(owner), {version: VERSION, records: this.list(owner).filter(entry => entry.move.id !== id)});},
  deleteAll(owner) {removeStored(keyFor(owner));},
  import(owner, value) {
    const clean = sanitizeRecord(value);
    // An import always creates a new move and cannot overwrite an existing one.
    const now = new Date().toISOString();
    clean.move = {...clean.move, id: newId(), createdAt: now, updatedAt: now};
    return this.save(owner, clean);
  },
  duplicate(owner, record) {
    return this.import(owner, {...record, move: {...record.move, title: `${record.move.title} (copy)`, completedAt: null}, wizard: {step: 'categories', furthestStep: 0}});
  },
  copyGuestMoves(owner) {
    for (const record of this.list('guest')) this.import(owner, record);
  }
};
