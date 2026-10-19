import React, {useState} from 'react';
import Icon from '../../shared/ui/Icon.jsx';
import MovingIllustration from '../../shared/ui/MovingIllustration.jsx';
import {totalsForRecord} from '../../services/inventoryExport.js';
import {useAuth} from '../auth/AuthProvider.jsx';
export const formatNumber = value => new Intl.NumberFormat('en-US', {maximumFractionDigits: 1}).format(value);
export const displayDate = value => value ? new Date(value + (value.length === 10 ? 'T12:00:00' : '')).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'}) : 'No date set';
export default function Dashboard({records, onNew, onOpen, onImport, onDuplicate, onDelete, onAuth}) {
  const {user} = useAuth();
  const [filter, setFilter] = useState('all');
  const filtered = records.filter(record => filter === 'all' || (filter === 'completed' ? record.move.completedAt : !record.move.completedAt));
  return <>
    <section className="dashboard-hero">
      <div className="hero-copy"><span className="eyebrow"><span className="tiny-line"/> A LITTLE PLANNING. A LIGHTER MOVE.</span>
        <h1>Your next chapter,<br/><em>all in one place.</em></h1>
        <p>From the sofa to the very last box. Make a little room for peace of mind with a moving inventory that keeps everything together.</p>
        <button className="button primary" onClick={onNew}>Plan a move<Icon name="arrow"/></button>
        <span className="hero-footnote"><Icon name="check" size={14}/> Free to use. No account needed.</span>
      </div>
      <MovingIllustration/>
    </section>
    <section className="moves-section" aria-labelledby="moves-title">
      <div className="section-heading"><div><span className="eyebrow">YOUR SPACE</span><h2 id="moves-title">{user ? `${user.name.split(' ')[0]}’s moves` : 'Your moves'}<span className="count-tag">{records.length}</span></h2></div>
        <div className="section-actions"><button className="button subtle" onClick={onImport}><Icon name="upload" size={17}/>Import backup</button>{records.length > 0 && <button className="button secondary" onClick={onNew}><Icon name="plus" size={17}/>New move</button>}</div>
      </div>
      {records.length > 0 && <div className="filter-tabs" role="group" aria-label="Filter moves">{['all','in-progress','completed'].map(id => <button key={id} className={filter === id ? 'active' : ''} onClick={() => setFilter(id)}>{id === 'all' ? 'All moves' : id === 'in-progress' ? 'In progress' : 'Completed'}</button>)}</div>}
      {filtered.length > 0 ? <div className="move-grid">{filtered.map(record => {
        const totals = totalsForRecord(record);
        return <article className="move-card" key={record.move.id}>
          <div className="move-card-top"><span className={'move-symbol ' + (record.move.completedAt ? 'done' : '')}><Icon name={record.move.completedAt ? 'check' : 'home'} size={24}/></span><span className={'status-pill ' + (record.move.completedAt ? 'done' : '')}>{record.move.completedAt ? 'Ready to move' : 'In progress'}</span></div>
          <button className="move-card-title" onClick={() => onOpen(record)}><h3>{record.move.title}</h3><Icon name="arrow"/></button>
          <p className="move-route">{record.move.from || record.move.to ? `${record.move.from || 'Your place'} → ${record.move.to || 'Somewhere new'}` : 'A fresh start is taking shape.'}</p>
          <div className="move-facts"><span><Icon name="calendar" size={15}/>{displayDate(record.move.movingDate)}</span><span><Icon name="box" size={15}/>{totals.count} {totals.count === 1 ? 'item' : 'items'}</span></div>
          <div className="move-card-bottom"><span>Updated {displayDate(record.move.updatedAt)}</span><div><button className="icon-button" onClick={() => onDuplicate(record)} aria-label={`Duplicate ${record.move.title}`} title="Duplicate move"><Icon name="copy" size={16}/></button><button className="icon-button" onClick={() => onDelete(record)} aria-label={`Delete ${record.move.title}`} title="Delete move"><Icon name="trash" size={16}/></button></div></div>
        </article>;
      })}<button className="new-move-card" onClick={onNew}><span className="circle-plus"><Icon name="plus" size={26}/></span><strong>Make room for a new move</strong><span>Every fresh start begins with a list.</span></button></div>
        : records.length ? <div className="empty-filter"><Icon name="box" size={32}/><h3>No {filter === 'completed' ? 'completed moves' : 'moves in progress'} yet.</h3><p>{filter === 'completed' ? 'Finish reviewing an inventory and it will appear here.' : 'Ready for another fresh start?'}</p><button className="text-button" onClick={filter === 'completed' ? () => setFilter('all') : onNew}>{filter === 'completed' ? 'See all moves' : 'Start a move'}<Icon name="arrow" size={16}/></button></div>
        : <div className="empty-moves"><div className="empty-moves-icon"><Icon name="box" size={38}/><span><Icon name="plus" size={14}/></span></div><div><h3>A blank canvas for your next chapter.</h3><p>Your saved inventories will live here. Start your first move and we’ll take it one room at a time.</p></div><button className="button secondary" onClick={onNew}>Create your first move<Icon name="arrow" size={17}/></button></div>}
    </section>
    <section className="how-it-works" aria-label="How it works">
      <div><span className="how-number">01</span><Icon name="sofa" size={24}/><h3>A place for everything</h3><p>Pick your categories and find your furniture in our ready-made catalog.</p></div>
      <div><span className="how-number">02</span><Icon name="box" size={24}/><h3>Count the little things</h3><p>Add your boxes and custom items. We’ll keep an eye on the totals.</p></div>
      <div><span className="how-number">03</span><Icon name="file" size={24}/><h3>Move with a clear head</h3><p>Review, download, and share your list with the people helping you move.</p></div>
    </section>
    {!user && <section className="account-callout"><span className="callout-icon"><Icon name="shield" size={25}/></span><div><h3>A little more organized.</h3><p>Create a local account to keep your moves in your own space on this browser.</p></div><button className="text-button" onClick={() => onAuth('signup')}>Create an account<Icon name="arrow" size={17}/></button></section>}
  </>;
}
