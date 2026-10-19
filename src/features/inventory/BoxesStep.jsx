import React from 'react';
import {items} from '../catalog/catalog.js';
import ItemCard from './ItemCard.jsx';
import Icon from '../../shared/ui/Icon.jsx';
const descriptions = {'86':'Books, tools & smaller heavy things','87':'Kitchenware, toys & everyday bits','88':'Linens, lampshades & lighter things','89':'A little extra care for your dishes','90':'Bulky bedding & soft furnishings','91':'Documents, folders & office supplies','92':'Larger files & important paperwork','93':'Hanging clothes, ready to go','95':'Framed art, photos & mirrors'};
export default function BoxesStep({onCustom}) {
  return <>
    <div className="step-intro"><span className="eyebrow">STEP 03 · THE LITTLE THINGS</span><h2>A box for every bit of your life.</h2><p>Books, memories, the kitchen drawer. Add the boxes you have, or make an estimate for now.</p></div>
    <div className="packing-tip"><span><Icon name="spark" size={22}/></span><div><strong>Small boxes. Heavy things.</strong><p>Save your small boxes for books and dishes. Larger boxes work best for light, bulky items.</p></div></div>
    <div className="catalog-grid boxes-grid">{items.filter(item => item.categoryId === 'boxes' && !item.isChild).map(item => <ItemCard key={item.id} item={item} boxDescription={descriptions[item.id]}/>)}</div>
    <div className="custom-box-callout"><div><h3>Not your average box?</h3><p>Add a specialty container or use your own measurements.</p></div><button className="button secondary" onClick={() => onCustom('boxes')}><Icon name="plus" size={16}/>Custom box</button></div>
  </>;
}
