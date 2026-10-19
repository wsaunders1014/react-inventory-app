import { createSlice } from '@reduxjs/toolkit';
import { selectTotals } from '../inventory/inventorySlice.js';
export const steps = [
  {id: 'categories', label: 'Categories', description: 'A place for everything'},
  {id: 'items', label: 'Your items', description: 'The big things'},
  {id: 'boxes', label: 'Boxes', description: 'And the little things'},
  {id: 'review', label: 'Review', description: 'One last look'}
];
export const stepIds = [...steps.map(step => step.id), 'completed'];
const slice = createSlice({
  name: 'wizard', initialState: {step: 'categories', furthestStep: 0},
  reducers: {
    stepChanged(state, {payload: step}) {
      if (!stepIds.includes(step)) return;
      state.step = step;
      state.furthestStep = Math.max(state.furthestStep, stepIds.indexOf(step));
    },
    wizardLoaded(_state, {payload}) {return payload;},
    wizardReset() {return {step: 'categories', furthestStep: 0};}
  }
});
export const { wizardLoaded, wizardReset } = slice.actions;
export const canContinue = state => state.wizard.step !== 'review' || selectTotals(state).count > 0;
export const continueWizard = () => (dispatch, getState) => {
  const state = getState();
  const index = stepIds.indexOf(state.wizard.step);
  if (!canContinue(state) || index === stepIds.length - 1) return;
  // A boxes-only move can skip the furniture browser.
  const next = state.wizard.step === 'categories' && !state.inventory.selectedCategoryIds.some(id => id !== 'boxes') ? 'boxes' : stepIds[index + 1];
  dispatch(slice.actions.stepChanged(next));
};
export const wentBack = () => (dispatch, getState) => {
  const state = getState();
  const index = stepIds.indexOf(state.wizard.step);
  const previous = state.wizard.step === 'boxes' && !state.inventory.selectedCategoryIds.some(id => id !== 'boxes') ? 'categories' : stepIds[Math.max(0, index - 1)];
  dispatch(slice.actions.stepChanged(previous));
};
export const goToStep = step => (dispatch, getState) => {
  if (steps.some(entry => entry.id === step) && stepIds.indexOf(step) <= getState().wizard.furthestStep) dispatch(slice.actions.stepChanged(step));
};
export const selectStep = state => state.wizard.step;
export default slice.reducer;
