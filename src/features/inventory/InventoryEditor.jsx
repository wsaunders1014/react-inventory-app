import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {steps, selectStep, continueWizard, wentBack, goToStep, canContinue} from '../wizard/wizardSlice.js';
import {selectTotals, selectFurnitureCategoryIds} from './inventorySlice.js';
import {moveCompleted, moveReopened} from '../moves/moveSlice.js';
import CategoryStep from './CategoryStep.jsx';
import ItemsStep from './ItemsStep.jsx';
import BoxesStep from './BoxesStep.jsx';
import ReviewStep from './ReviewStep.jsx';
import CompletedStep from './CompletedStep.jsx';
import InventorySummary from './InventorySummary.jsx';
import CustomItemModal from './CustomItemModal.jsx';
import PrintInventory from './PrintInventory.jsx';
import MoveDetailsForm from '../moves/MoveDetailsForm.jsx';
import Modal from '../../shared/ui/Modal.jsx';
import Icon from '../../shared/ui/Icon.jsx';
import {formatNumber} from '../moves/Dashboard.jsx';
export default function InventoryEditor({onDashboard, onConfirm, onExport, onAuth, user, saveStatus, onToast}) {
  const step = useSelector(selectStep);
  const furthest = useSelector(state => state.wizard.furthestStep);
  const move = useSelector(state => state.move);
  const totals = useSelector(selectTotals);
  const categoryIds = useSelector(selectFurnitureCategoryIds);
  const allowed = useSelector(canContinue);
  const [customCategory, setCustomCategory] = useState(null);
  const [details, setDetails] = useState(false);
  const headingRef = useRef(null);
  const dispatch = useDispatch();
  const done = step === 'completed';
  const currentIndex = steps.findIndex(entry => entry.id === step);
  useEffect(() => {window.scrollTo({top: 0, behavior: 'instant'}); headingRef.current?.focus({preventScroll:true});}, [step]);
  const go = id => {dispatch(moveReopened()); dispatch(goToStep(id));};
  const forward = () => {
    if (step === 'review' && allowed) dispatch(moveCompleted());
    dispatch(continueWizard());
  };
  const print = () => window.print();
  return <>
    <div className="editor-topline"><button className="text-button back-to-moves" onClick={onDashboard}><Icon name="back" size={16}/>My moves</button><span className={'save-status ' + (saveStatus === 'error' ? 'error' : '')}><Icon name={saveStatus === 'error' ? 'info' : saveStatus === 'saving' ? 'clock' : 'check'} size={13}/>{saveStatus === 'error' ? 'Not saved · download a backup' : saveStatus === 'saving' ? 'Saving…' : 'Saved in this browser'}</span></div>
    <div className="editor-title"><div><span className="eyebrow">YOUR NEXT CHAPTER</span><h1 ref={headingRef} tabIndex={-1}>{move.title || 'My next chapter'}</h1><p>{move.from || move.to ? `${move.from || 'Your place'} → ${move.to || 'Somewhere new'}` : 'One little list. A little less to think about.'}</p></div><button className="button subtle" onClick={() => setDetails(true)}><Icon name="edit" size={16}/>Move details</button></div>
    {!done && <nav className="wizard-nav" aria-label="Inventory steps">{steps.map((entry, index) => <button key={entry.id} type="button" disabled={index > furthest} className={(index === currentIndex ? 'active' : '') + (index < currentIndex ? ' visited' : '')} onClick={() => go(entry.id)} aria-current={step === entry.id ? 'step' : undefined}><span className="step-number">{index < currentIndex ? <Icon name="check" size={15}/> : String(index + 1).padStart(2,'0')}</span><span><strong>{entry.label}</strong><small>{entry.description}</small></span>{index < steps.length - 1 && <Icon name="chevron" className="step-arrow" size={15}/>}</button>)}</nav>}
    {!done && <div className="mobile-totals" aria-label="Inventory totals"><span><Icon name="box" size={15}/><strong>{totals.count}</strong> items</span><span>{formatNumber(totals.cf)} cu ft</span><span>{formatNumber(totals.lbs)} lb</span></div>}
    {done ? <CompletedStep onExport={onExport} onPrint={print} onEdit={() => go('review')} onDashboard={onDashboard} onAuth={onAuth} user={user}/> : <div className="editor-layout">
      <main className="editor-panel" id="inventory-content">
        {step === 'categories' && <CategoryStep onConfirm={onConfirm}/>}
        {step === 'items' && <ItemsStep onCustom={setCustomCategory} onCategories={() => go('categories')}/>}
        {step === 'boxes' && <BoxesStep onCustom={setCustomCategory}/>}
        {step === 'review' && <ReviewStep onExport={onExport} onPrint={print} onAddItems={() => go('items')} onBoxes={() => go('boxes')}/>}
      </main>
      <InventorySummary onConfirm={onConfirm} onCategories={() => go('categories')} onExport={onExport}/>
    </div>}
    {!done && <div className="wizard-footer"><div><button className="button back-button" onClick={step === 'categories' ? onDashboard : () => dispatch(wentBack())}><Icon name="back" size={17}/>{step === 'categories' ? 'My moves' : 'Back'}</button><span className="wizard-footer-hint">{step === 'categories' ? categoryIds.length ? `${categoryIds.length} categories selected` : 'Only boxes? Skip ahead.' : step === 'review' ? totals.count ? 'Looking good. Ready when you are.' : 'Add an item to complete your list.' : 'It’s all saved as you go.'}</span></div><button className="button primary" onClick={forward} disabled={!allowed}>{step === 'categories' ? categoryIds.length ? 'Add your items' : 'Go to boxes' : step === 'items' ? 'Add boxes' : step === 'boxes' ? 'Review inventory' : 'Complete inventory'}<Icon name={step === 'review' ? 'check' : 'arrow'} size={18}/></button></div>}
    {customCategory && <CustomItemModal categoryId={customCategory} onClose={() => setCustomCategory(null)} onAdded={() => onToast('Custom item added to your inventory.')}/>}
    {details && <Modal title="The details of your move" onClose={() => setDetails(false)}><p className="modal-intro">Give this chapter a name. Everything here is saved as you go.</p><MoveDetailsForm/><button className="button primary full details-done" onClick={() => setDetails(false)}>Done<Icon name="check" size={17}/></button></Modal>}
    <PrintInventory/>
  </>;
}
