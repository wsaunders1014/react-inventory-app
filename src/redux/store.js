import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/index.js';

export const createAppStore = () => configureStore({ reducer: rootReducer });
export default createAppStore();
