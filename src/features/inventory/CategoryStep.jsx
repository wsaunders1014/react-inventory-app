import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {categories, items} from '../catalog/catalog.js';
import {categorySelected, categoryDeselected, selectFurnitureCategoryIds, selectCategoryCounts} from './inventorySlice.js';
import Icon, {categoryIcons} from '../../shared/ui/Icon.jsx';
const categoryDescriptions = {'sofas-couches':'Sofas, sectionals & armchairs','dressers-cabinets':'Storage with a little character','tables-chairs':'Gather around, settle in',desks:'Your workspace, reimagined','musical-instruments':'Bring the good vibrations','tvs-electronics':'Screens, speakers & more',appliances:'The everyday essentials',bookcases:'A new home for your stories','beds-cribs':'Rest easy in your new place',futons:'Flexible furniture favorites','children-nursery':'Little things, big adventures','lamps-mirrors':'A brighter kind of space','motorcycles-atvs':'Your next adventure',tools:'For making yourself at home','sports-hobbies':'Make room for what you love',miscellaneous:'Everything else that matters'};
export default function CategoryStep({onConfirm}) {
  const selected = useSelector(selectFurnitureCategoryIds);
  const counts = useSelector(selectCategoryCounts);
  const dispatch = useDispatch();
  const toggle = category => {
    if (!selected.includes(category.id)) dispatch(categorySelected(category.id));
    else if (counts[category.id]) onConfirm({title: `Remove ${category.name}?`, message: `This removes ${counts[category.id]} ${counts[category.id] === 1 ? 'item' : 'items'} in this category from your inventory. You can add them again later.`, action: 'Remove category', onConfirm: () => dispatch(categoryDeselected(category.id))});
    else dispatch(categoryDeselected(category.id));
  };
  return <>
    <div className="step-intro"><span className="eyebrow">STEP 01 · SET THE SCENE</span><h2>What’s coming with you?</h2><p>Choose the categories that feel like home. You can always add more later.</p></div>
    <div className="category-selection-bar"><span>{selected.length ? `${selected.length} ${selected.length === 1 ? 'category' : 'categories'} selected` : 'Select a few, or skip straight to boxes.'}</span><button type="button" className="text-button" onClick={() => categories.filter(category => category.id !== 'boxes').forEach(category => dispatch(categorySelected(category.id)))}>Select all</button></div>
    <div className="category-grid">{categories.filter(category => category.id !== 'boxes').map(category => <button type="button" key={category.id} className={'category-card' + (selected.includes(category.id) ? ' selected' : '')} aria-pressed={selected.includes(category.id)} onClick={() => toggle(category)}>
      <span className="category-icon"><Icon name={categoryIcons[category.id]} size={31}/></span><span className="category-check"><Icon name={selected.includes(category.id) ? 'check' : 'plus'} size={14}/></span>
      <strong>{category.name}</strong><span>{categoryDescriptions[category.id]}</span>
    </button>)}</div>
    <p className="step-help"><Icon name="info" size={16}/> Just moving boxes? You can skip this step and add boxes next.</p>
  </>;
}
