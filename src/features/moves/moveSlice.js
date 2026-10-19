import {createSlice} from '@reduxjs/toolkit';
export const emptyMove = () => ({id: null, title: 'My next chapter', movingDate: '', from: '', to: '', notes: '', createdAt: null, updatedAt: null, completedAt: null});
const slice = createSlice({name: 'move', initialState: emptyMove(), reducers: {
  moveLoaded(_state, {payload}) {return payload;},
  detailsChanged(state, {payload}) {
    for (const key of ['title', 'movingDate', 'from', 'to', 'notes']) {
      if (typeof payload[key] === 'string') state[key] = payload[key].slice(0, key === 'notes' ? 2000 : 120);
    }
  },
  moveCompleted(state) {state.completedAt = new Date().toISOString();},
  moveReopened(state) {state.completedAt = null;}
}});
export const {moveLoaded, detailsChanged, moveCompleted, moveReopened} = slice.actions;
export default slice.reducer;
