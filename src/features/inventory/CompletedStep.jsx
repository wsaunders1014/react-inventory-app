import React from 'react';
import {useSelector} from 'react-redux';
import {selectTotals} from './inventorySlice.js';
import Icon from '../../shared/ui/Icon.jsx';
import {formatNumber, displayDate} from '../moves/Dashboard.jsx';
export default function CompletedStep({onExport, onPrint, onEdit, onDashboard, onAuth, user}) {
  const move = useSelector(state => state.move);
  const totals = useSelector(selectTotals);
  return <section className="completed-screen">
    <div className="completed-art"><span className="completed-circle"><Icon name="check" size={42}/></span><span className="completion-spark one">✦</span><span className="completion-spark two">✧</span><span className="completion-spark three">✦</span></div>
    <span className="eyebrow">ONE LESS THING ON YOUR MIND</span><h2>You’ve made room<br/>for <em>what’s next.</em></h2><p>Your inventory is ready. Here’s to a lighter move and a lovely new beginning.</p>
    <div className="completion-ticket"><div className="completion-ticket-top"><Icon name="home" size={26}/><div><h3>{move.title || 'My next chapter'}</h3><span>{move.movingDate ? `Moving ${displayDate(move.movingDate)}` : 'Ready when you are.'}</span></div><span className="status-pill done">Ready to move</span></div><div className="completion-ticket-stats"><div><strong>{formatNumber(totals.count)}</strong><span>items</span></div><div><strong>{formatNumber(totals.cf)}</strong><span>cu ft · est.</span></div><div><strong>{formatNumber(totals.lbs)}</strong><span>lb · est.</span></div></div></div>
    <div className="completion-actions"><button className="button primary" onClick={() => onExport('csv')}><Icon name="download" size={18}/>Download inventory</button><button className="button secondary" onClick={onPrint}><Icon name="print" size={18}/>Print / save PDF</button></div>
    <div className="completion-links"><button className="text-button" onClick={onEdit}><Icon name="edit" size={15}/>Make a change</button><span>·</span><button className="text-button" onClick={onDashboard}>Back to my moves<Icon name="arrow" size={15}/></button></div>
    {!user && <div className="completion-account"><Icon name="shield" size={20}/><p>Keep your moves in your own space.<br/><button className="text-button" onClick={() => onAuth('signup')}>Create a local account<Icon name="arrow" size={14}/></button></p></div>}
    <p className="completion-storage-note">Saved in this browser. Download a JSON backup to transfer or restore your move.</p>
    <button className="text-button" onClick={() => onExport('json')}>Download backup (.json)</button>
  </section>;
}
