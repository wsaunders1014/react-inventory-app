import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {categories} from '../catalog/catalog.js';
import {customItemAdded} from './inventorySlice.js';
import Modal from '../../shared/ui/Modal.jsx';
import Icon from '../../shared/ui/Icon.jsx';
import {newId} from '../../services/storage.js';
export default function CustomItemModal({categoryId = 'miscellaneous', onClose, onAdded}) {
  const [values, setValues] = useState({name:'', categoryId, cf:'', lbs:''});
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const change = event => setValues({...values, [event.target.name]:event.target.value});
  const submit = event => {
    event.preventDefault();
    if (!values.name.trim()) {setError('Give your item a name.'); return;}
    const cf = Number(values.cf); const lbs = Number(values.lbs);
    if (![cf, lbs].every(value => Number.isFinite(value) && value >= 0 && value <= 100000)) {setError('Enter a volume and weight between 0 and 100,000.'); return;}
    dispatch(customItemAdded({...values, name: values.name.trim(), cf, lbs, id: 'custom-' + newId()}));
    onAdded?.(); onClose();
  };
  return <Modal title="Something a little different?" onClose={onClose}>
    <p className="modal-intro">Add anything you can’t find in the catalog. A good guess is fine for the measurements.</p>
    <form className="form-stack" onSubmit={submit}>
      <label>Item name<input name="name" value={values.name} onChange={change} placeholder="e.g. Grandma’s rocking chair" maxLength={100} required autoFocus/></label>
      <label>Category<select name="categoryId" value={values.categoryId} onChange={change}>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      <div className="form-row"><label>Volume <span className="label-optional">(cu ft)</span><input type="number" name="cf" inputMode="decimal" value={values.cf} onChange={change} min="0" max="100000" step="0.1" placeholder="0"/></label><label>Weight <span className="label-optional">(lb)</span><input type="number" name="lbs" inputMode="decimal" value={values.lbs} onChange={change} min="0" max="100000" step="0.1" placeholder="0"/></label></div>
      <p className="field-hint">Measurements are optional. Leave them blank if you’re unsure.</p>
      {error && <p role="alert" className="form-error">{error}</p>}
      <button className="button primary full">Add to my inventory<Icon name="plus" size={18}/></button>
    </form>
  </Modal>;
}
