import {describe, it, expect} from 'vitest';
import {createAppStore} from '../store.js';
import {items, categoriesById} from '../../features/catalog/catalog.js';
import {categorySelected, categoryDeselected, activeCategoryChanged, itemAdded, itemRemoved, quantityChanged, customItemAdded, selectTotals, MAX_QUANTITY} from '../../features/inventory/inventorySlice.js';
import {continueWizard, wentBack, goToStep} from '../../features/wizard/wizardSlice.js';
import {createMove} from '../../services/moveRepository.js';
const desk = items.find(item => item.categoryId === 'desks' && !item.isChild);
const lamp = items.find(item => item.categoryId === 'lamps-mirrors' && !item.isChild);
describe('normalized inventory', () => {
  it('derives totals atomically, preserves prior state, and prevents negative quantities', () => {
    const store = createAppStore();
    const previous = store.getState();
    store.dispatch(itemAdded(desk.id)); store.dispatch(itemAdded(desk.id));
    expect(previous.inventory.quantities).toEqual({});
    expect(selectTotals(store.getState())).toEqual({count:2, boxes:0, cf:desk.cf*2, lbs:desk.lbs*2});
    for (let i=0;i<3;i++) store.dispatch(itemRemoved(desk.id));
    expect(store.getState().inventory.quantities).toEqual({});
    expect(selectTotals(store.getState())).toEqual({count:0, boxes:0, cf:0, lbs:0});
  });
  it('includes search additions in navigation and clears deselected inventory', () => {
    const store = createAppStore();
    store.dispatch(itemAdded(desk.id)); store.dispatch(itemAdded(lamp.id)); store.dispatch(categorySelected(desk.categoryId));
    expect(store.getState().inventory.selectedCategoryIds).toEqual([desk.categoryId,lamp.categoryId]);
    store.dispatch(activeCategoryChanged(lamp.categoryId)); store.dispatch(categoryDeselected(lamp.categoryId));
    expect(store.getState().inventory.activeCategoryId).toBe(desk.categoryId);
    expect(selectTotals(store.getState()).count).toBe(1);
    store.dispatch(categoryDeselected(desk.categoryId));
    expect(store.getState().inventory.activeCategoryId).toBeNull();
    expect(selectTotals(store.getState())).toEqual({count:0,boxes:0,cf:0,lbs:0});
    store.dispatch(categorySelected(desk.categoryId));
    expect(store.getState().inventory.quantities).toEqual({});
  });
  it('supports boxes, custom items, explicit quantities and input bounds', () => {
    const store = createAppStore();
    store.dispatch(itemAdded('86'));
    expect(store.getState().inventory.activeCategoryId).toBeNull();
    expect(selectTotals(store.getState()).boxes).toBe(1);
    store.dispatch(quantityChanged({id:'86',quantity:MAX_QUANTITY})); store.dispatch(itemAdded('86'));
    expect(store.getState().inventory.quantities['86']).toBe(MAX_QUANTITY);
    store.dispatch(quantityChanged({id:'86',quantity:-1})); store.dispatch(quantityChanged({id:'86',quantity:1.5}));
    expect(store.getState().inventory.quantities['86']).toBe(MAX_QUANTITY);
    store.dispatch(customItemAdded({id:'custom-test',name:'Antique chair',categoryId:'desks',cf:5.5,lbs:20}));
    expect(selectTotals(store.getState()).count).toBe(1000);
    expect(store.getState().inventory.activeCategoryId).toBe('desks');
    store.dispatch(categoryDeselected('desks'));
    expect(store.getState().inventory.customItems).toEqual({});
    store.dispatch(itemAdded('missing')); store.dispatch(itemAdded('__proto__'));
    expect(Object.keys(store.getState().inventory.quantities)).toEqual(['86']);
  });
  it('loads moves in one observable state transition', () => {
    const store = createAppStore(); const record = createMove('First');
    store.dispatch({type:'workspace/loaded',payload:record}); store.dispatch(itemAdded(desk.id));
    const states=[];store.subscribe(() => states.push(store.getState()));
    const second=createMove('Second'); store.dispatch({type:'workspace/loaded',payload:second});
    expect(states).toHaveLength(1);expect(states[0].move.title).toBe('Second');expect(states[0].inventory.quantities).toEqual({});
  });
  it('has unique IDs and valid catalog category and variant references', () => {
    expect(new Set(items.map(item => item.id)).size).toBe(items.length);
    const childIds = items.flatMap(item => Array.isArray(item.hasChildren) ? item.hasChildren.map(String) : []);
    for (const child of items.filter(item => item.isChild)) expect(childIds).toContain(child.id);
    for (const item of items) {
      expect(categoriesById[item.categoryId]).toBeDefined();
      expect(Number.isFinite(item.cf)&&Number.isFinite(item.lbs)).toBe(true);
      if (Array.isArray(item.hasChildren)) for (const id of item.hasChildren) expect(items.some(child => child.id === String(id) && child.categoryId === item.categoryId && child.name === item.name && child.isChild)).toBe(true);
    }
  });
});
describe('complete wizard', () => {
  it('allows boxes-only moves and requires an item before completion', () => {
    const store=createAppStore(); store.dispatch(wentBack()); expect(store.getState().wizard.step).toBe('categories');
    store.dispatch(continueWizard()); expect(store.getState().wizard.step).toBe('boxes');
    store.dispatch(wentBack()); expect(store.getState().wizard.step).toBe('categories');
    store.dispatch(continueWizard()); store.dispatch(continueWizard()); expect(store.getState().wizard.step).toBe('review');
    store.dispatch(continueWizard()); expect(store.getState().wizard.step).toBe('review');
    store.dispatch(itemAdded('86')); store.dispatch(continueWizard());expect(store.getState().wizard.step).toBe('completed');
    store.dispatch(continueWizard());expect(store.getState().wizard.step).toBe('completed');
    store.dispatch(wentBack()); expect(store.getState().wizard.step).toBe('review');
  });
  it('visits all steps with selected furniture and bounds direct navigation', () => {
    const store=createAppStore(); store.dispatch(goToStep('review'));expect(store.getState().wizard.step).toBe('categories');
    store.dispatch(categorySelected('desks'));store.dispatch(continueWizard());expect(store.getState().wizard.step).toBe('items');
    store.dispatch(itemAdded(desk.id));store.dispatch(continueWizard());expect(store.getState().wizard.step).toBe('boxes');
    store.dispatch(continueWizard());expect(store.getState().wizard.step).toBe('review');
    store.dispatch(goToStep('categories'));expect(store.getState().wizard.step).toBe('categories');
    store.dispatch(goToStep('review'));expect(store.getState().wizard.step).toBe('review');
    store.dispatch(goToStep('missing'));expect(store.getState().wizard.step).toBe('review');
  });
});
