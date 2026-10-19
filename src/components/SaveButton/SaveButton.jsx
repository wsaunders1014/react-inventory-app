import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCanContinue } from '../../features/inventory/inventorySlice.js';
import { selectStep, continueWizard } from '../../features/wizard/wizardSlice.js';
import './SaveButton.css';
export default function SaveButton() {
  const dispatch = useDispatch();
  const canProgress = useSelector(selectCanContinue);
  const step = useSelector(selectStep);
  if (step === 'items') return <div id="save-button" className="to-items cta">BOXES & REVIEW COMING SOON<span>Selections are kept only until you reload.</span></div>;
  return <div id="save-button" className={'to-items cta' + (canProgress ? ' canProgress' : '')} onClick={() => dispatch(continueWizard())}>CONTINUE<span>Select categories to continue.</span></div>;
}
