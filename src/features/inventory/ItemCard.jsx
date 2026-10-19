import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {itemsById, imageFor} from '../catalog/catalog.js';
import {itemAdded} from './inventorySlice.js';
import QuantityControl from './QuantityControl.jsx';
import Icon, {categoryIcons} from '../../shared/ui/Icon.jsx';
import {formatNumber} from '../moves/Dashboard.jsx';
export default function ItemCard({item, boxDescription}) {
  const [selectedId, setSelectedId] = useState(item.id);
  const [imageFailed, setImageFailed] = useState(false);
  const variants = [item, ...(Array.isArray(item.hasChildren) ? item.hasChildren.map(id => itemsById[String(id)]).filter(Boolean) : [])];
  const active = variants.find(variant => variant.id === selectedId) || item;
  const quantity = useSelector(state => state.inventory.quantities[active.id] || 0);
  const dispatch = useDispatch();
  return <article className={'catalog-card' + (quantity ? ' is-owned' : '')}>
    <div className={'catalog-image' + (active.categoryId === 'boxes' ? ' box-image' : '')}>
      {active.categoryId === 'boxes' ? <Icon name="box" size={56}/> : imageFor(active) && !imageFailed ? <img src={`${import.meta.env.BASE_URL}img/items/${imageFor(active)}`} alt="" loading="lazy" onError={() => setImageFailed(true)}/> : <Icon name={categoryIcons[active.categoryId]} size={52}/>}
      {quantity > 0 && <span className="owned-badge"><Icon name="check" size={12}/>{quantity} added</span>}
      {active.id.startsWith('custom-') && <span className="custom-badge">Custom</span>}
    </div>
    <div className="catalog-card-content"><h3>{item.name.replace(' (aka China Box)', '').replace('Xtra', 'Extra')}</h3>
      {boxDescription && <p className="box-description">{boxDescription}</p>}
      {variants.length > 1 ? <label className="variant-label"><span className="sr-only">Size of {item.name}</span><select value={active.id} onChange={event => {setSelectedId(event.target.value); setImageFailed(false);}}>{variants.map(variant => <option key={variant.id} value={variant.id}>{variant.size || variant.name}</option>)}</select></label> : item.size && <p className="item-size">{item.size}</p>}
      <p className="item-estimate">{formatNumber(active.cf)} cu ft <span>·</span> {formatNumber(active.lbs)} lb</p>
      {quantity > 0 ? <QuantityControl item={active}/> : <button type="button" className="add-item-button" onClick={() => dispatch(itemAdded(active.id))}><Icon name="plus" size={16}/>Add {active.categoryId === 'boxes' ? 'box' : 'item'}</button>}
    </div>
  </article>;
}
