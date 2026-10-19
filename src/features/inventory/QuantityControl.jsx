import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {itemAdded, itemRemoved, quantityChanged, MAX_QUANTITY} from './inventorySlice.js';
import Icon from '../../shared/ui/Icon.jsx';
export default function QuantityControl({item, compact = false}) {
  const dispatch = useDispatch();
  const quantity = useSelector(state => state.inventory.quantities[item.id] || 0);
  const [value, setValue] = useState(String(quantity));
  useEffect(() => setValue(String(quantity)), [quantity]);
  const commit = () => {
    const number = Number(value);
    if (value.trim() !== '' && Number.isInteger(number) && number >= 0 && number <= MAX_QUANTITY) dispatch(quantityChanged({id: item.id, quantity: number}));
    else setValue(String(quantity));
  };
  return <div className={'quantity-control' + (compact ? ' compact' : '')}>
    <button type="button" aria-label={`Remove one ${item.name}`} disabled={quantity === 0} onClick={() => dispatch(itemRemoved(item.id))}><Icon name="minus" size={16}/></button>
    <input type="text" inputMode="numeric" pattern="[0-9]*" value={value} aria-label={`Quantity of ${item.size ? item.size + ' ' : ''}${item.name}`}
      onChange={event => {if (/^\d{0,3}$/.test(event.target.value)) {setValue(event.target.value); if (event.target.value !== '') dispatch(quantityChanged({id: item.id, quantity: Number(event.target.value)}));}}}
      onBlur={commit} onKeyDown={event => {if (event.key === 'Enter') {event.preventDefault(); commit(); event.currentTarget.blur();}}}/>
    <button type="button" aria-label={`Add one ${item.name}`} disabled={quantity >= MAX_QUANTITY} onClick={() => dispatch(itemAdded(item.id))}><Icon name="plus" size={16}/></button>
  </div>;
}
