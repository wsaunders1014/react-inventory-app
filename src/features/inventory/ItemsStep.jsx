import React, {useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {items, categoriesById} from '../catalog/catalog.js';
import {selectActiveCategoryId, selectCustomItems, selectQuantities, activeCategoryChanged, selectFurnitureCategoryIds} from './inventorySlice.js';
import ItemCard from './ItemCard.jsx';
import Icon, {categoryIcons} from '../../shared/ui/Icon.jsx';
export default function ItemsStep({onCustom, onCategories}) {
  const active = useSelector(selectActiveCategoryId);
  const custom = useSelector(selectCustomItems);
  const quantities = useSelector(selectQuantities);
  const selected = useSelector(selectFurnitureCategoryIds);
  const [query, setQuery] = useState('');
  const [onlyAdded, setOnlyAdded] = useState(false);
  const dispatch = useDispatch();
  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return [...items, ...Object.values(custom)].filter(item => {
      if (item.categoryId === 'boxes' || item.isChild) return false;
      const variants = Array.isArray(item.hasChildren) ? item.hasChildren : [];
      if (onlyAdded && !quantities[item.id] && !variants.some(id => quantities[id])) return false;
      return text ? `${item.name} ${item.size} ${categoriesById[item.categoryId]?.name}`.toLowerCase().includes(text) : item.categoryId === active;
    });
  }, [active, custom, quantities, query, onlyAdded]);
  const groups = Object.groupBy(filtered, item => query.trim() ? categoriesById[item.categoryId].name : item.subcategory || 'All items');
  return <>
    <div className="step-intro"><span className="eyebrow">STEP 02 · THE BIG THINGS</span><h2>A little inventory. A lot less worry.</h2><p>Add your furniture and belongings. Choose a size, then tap to add as many as you need.</p></div>
    <div className="catalog-toolbar"><label className="search-field"><Icon name="search"/><span className="sr-only">Search all furniture</span><input type="search" placeholder="Search all furniture…" value={query} onChange={event => setQuery(event.target.value)}/>{query && <button className="icon-button" type="button" aria-label="Clear search" onClick={() => setQuery('')}><Icon name="close" size={16}/></button>}</label><button className="button secondary" onClick={() => onCustom(active || 'miscellaneous')}><Icon name="plus" size={16}/>Custom item</button></div>
    {!query.trim() && <div className="category-chips" role="group" aria-label="Browse your selected categories">{selected.map(id => <button key={id} className={active === id ? 'active' : ''} aria-pressed={active === id} onClick={() => dispatch(activeCategoryChanged(id))}><Icon name={categoryIcons[id]} size={16}/>{categoriesById[id].name}</button>)}<button className="add-category-chip" onClick={onCategories}><Icon name="plus" size={15}/>Categories</button></div>}
    <div className="catalog-results-heading"><h3>{query.trim() ? `Results for “${query.trim()}”` : categoriesById[active]?.name || 'Your furniture'}<span>{filtered.length} options</span></h3><label className="toggle-label"><input type="checkbox" checked={onlyAdded} onChange={event => setOnlyAdded(event.target.checked)}/>Added only</label></div>
    {filtered.length ? Object.entries(groups).map(([name, group]) => <section className="catalog-group" key={name} aria-label={name}><h4>{name.replaceAll('_',' ')}</h4><div className="catalog-grid">{group.map(item => <ItemCard key={item.id} item={item}/>)}</div></section>) : <div className="catalog-empty"><Icon name="search" size={32}/><h3>{onlyAdded ? 'Nothing added here yet.' : query ? 'Nothing quite like that yet.' : 'Let’s make a little room.'}</h3><p>{onlyAdded ? 'Turn off “Added only” to browse the catalog.' : query ? 'Try another word, or add a custom item to your list.' : 'Choose a category or search the entire furniture catalog.'}</p><button className="button secondary" onClick={onlyAdded ? () => setOnlyAdded(false) : () => onCustom(active || 'miscellaneous')}>{onlyAdded ? 'Browse all items' : 'Add custom item'}</button></div>}
    <div className="catalog-bottom-note"><Icon name="info" size={17}/><p>Weights and volumes are planning estimates. Your actual items may vary.</p></div>
  </>;
}
