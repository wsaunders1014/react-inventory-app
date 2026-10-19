import { createSlice, createSelector } from '@reduxjs/toolkit';
import { categoriesById, itemsById } from '../catalog/catalog.js';
export const emptyInventory = () => ({ selectedCategoryIds: [], activeCategoryId: null, quantities: {}, customItems: {} });
export const MAX_QUANTITY = 999;
const lookup = (state, id) => Object.hasOwn(itemsById, id) ? itemsById[id] : Object.hasOwn(state.customItems, id) ? state.customItems[id] : null;
const selectCategory = (state, id) => {
  if (!state.selectedCategoryIds.includes(id)) state.selectedCategoryIds.push(id);
  if (id !== 'boxes') state.activeCategoryId ??= id;
};
const slice = createSlice({
  name: 'inventory', initialState: emptyInventory(),
  reducers: {
    categorySelected(state, {payload: id}) {
      if (Object.hasOwn(categoriesById, id) && id !== 'boxes') selectCategory(state, id);
    },
    categoryDeselected(state, {payload: id}) {
      state.selectedCategoryIds = state.selectedCategoryIds.filter(key => key !== id);
      for (const itemId of Object.keys(state.quantities)) {
        if (lookup(state, itemId)?.categoryId === id) delete state.quantities[itemId];
      }
      for (const itemId of Object.keys(state.customItems)) {
        if (state.customItems[itemId].categoryId === id) delete state.customItems[itemId];
      }
      if (state.activeCategoryId === id) state.activeCategoryId = state.selectedCategoryIds.find(key => key !== 'boxes') ?? null;
    },
    activeCategoryChanged(state, {payload: id}) {
      if (id !== 'boxes' && state.selectedCategoryIds.includes(id)) state.activeCategoryId = id;
    },
    itemAdded(state, {payload: id}) {
      const item = lookup(state, id);
      if (!item) return;
      selectCategory(state, item.categoryId);
      state.quantities[id] = Math.min(MAX_QUANTITY, (state.quantities[id] || 0) + 1);
    },
    itemRemoved(state, {payload: id}) {
      if (!state.quantities[id]) return;
      if (--state.quantities[id] === 0) delete state.quantities[id];
    },
    quantityChanged(state, {payload: {id, quantity}}) {
      const item = lookup(state, id);
      if (!item || !Number.isInteger(quantity) || quantity < 0 || quantity > MAX_QUANTITY) return;
      if (quantity === 0) delete state.quantities[id];
      else {selectCategory(state, item.categoryId); state.quantities[id] = quantity;}
    },
    customItemAdded(state, {payload: item}) {
      if (!item || !/^custom-[\w-]+$/.test(item.id) || !item.name?.trim() || item.name.length > 100 || !Object.hasOwn(categoriesById, item.categoryId)) return;
      if (![item.cf, item.lbs].every(value => Number.isFinite(value) && value >= 0 && value <= 100000)) return;
      state.customItems[item.id] = {...item, name: item.name.trim(), image: false, isChild: false, hasChildren: false, subcategory: 'Your items', size: ''};
      selectCategory(state, item.categoryId);
      state.quantities[item.id] = 1;
    },
    inventoryLoaded(_state, {payload}) {return payload;},
    inventoryReset() {return emptyInventory();}
  }
});
export const { categorySelected, categoryDeselected, activeCategoryChanged, itemAdded, itemRemoved, quantityChanged, customItemAdded, inventoryLoaded, inventoryReset } = slice.actions;
export default slice.reducer;
export const selectSelectedCategoryIds = state => state.inventory.selectedCategoryIds;
export const selectFurnitureCategoryIds = createSelector([selectSelectedCategoryIds], ids => ids.filter(id => id !== 'boxes'));
export const selectActiveCategoryId = state => state.inventory.activeCategoryId;
export const selectCanContinue = state => state.inventory.selectedCategoryIds.some(id => id !== 'boxes');
export const selectQuantities = state => state.inventory.quantities;
export const selectCustomItems = state => state.inventory.customItems;
export const selectInventoryEntries = createSelector([selectQuantities, selectCustomItems], (quantities, custom) => Object.entries(quantities).flatMap(([id, quantity]) => {
  const item = itemsById[id] || custom[id];
  return item ? [{...item, quantity}] : [];
}));
export const selectTotals = createSelector([selectInventoryEntries], entries => entries.reduce((totals, item) => ({
  count: totals.count + item.quantity,
  boxes: totals.boxes + (item.categoryId === 'boxes' ? item.quantity : 0),
  cf: Math.round((totals.cf + item.cf * item.quantity) * 100) / 100,
  lbs: Math.round((totals.lbs + item.lbs * item.quantity) * 100) / 100
}), {count: 0, boxes: 0, cf: 0, lbs: 0}));
export const selectCategoryCounts = createSelector([selectInventoryEntries], entries => entries.reduce((counts, item) => {
  counts[item.categoryId] = (counts[item.categoryId] || 0) + item.quantity;
  return counts;
}, {}));
