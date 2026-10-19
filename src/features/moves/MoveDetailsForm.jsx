import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {detailsChanged} from './moveSlice.js';
export default function MoveDetailsForm() {
  const move = useSelector(state => state.move);
  const dispatch = useDispatch();
  const change = event => dispatch(detailsChanged({[event.target.name]: event.target.value}));
  return <div className="form-stack move-details-form">
    <label>Give your move a name<input name="title" value={move.title} onChange={change} maxLength={120} placeholder="e.g. Our new home"/></label>
    <div className="form-row"><label>Moving from<input name="from" value={move.from} onChange={change} maxLength={120} placeholder="City or neighborhood" autoComplete="off"/></label><label>Moving to<input name="to" value={move.to} onChange={change} maxLength={120} placeholder="Somewhere new" autoComplete="off"/></label></div>
    <label>Moving date <span className="label-optional">(optional)</span><input name="movingDate" type="date" value={move.movingDate} onChange={change}/></label>
    <label>Anything else to remember? <span className="label-optional">(optional)</span><textarea name="notes" value={move.notes} onChange={change} maxLength={2000} rows={3} placeholder="Fragile items, access instructions, things to pack last…"/></label>
  </div>;
}
