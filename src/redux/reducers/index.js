import {combineReducers} from '@reduxjs/toolkit';
import inventory from '../../features/inventory/inventorySlice.js';
import wizard from '../../features/wizard/wizardSlice.js';
import move from '../../features/moves/moveSlice.js';
const combined = combineReducers({inventory, wizard, move});
export default function rootReducer(state, action) {
  // Loading a document is atomic: subscribers never see the old move with a new inventory.
  if (action.type === 'workspace/loaded') return {inventory: action.payload.inventory, wizard: action.payload.wizard, move: action.payload.move};
  return combined(state, action);
}
