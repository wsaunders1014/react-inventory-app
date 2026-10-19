import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import App from './App.jsx';
import store from './redux/store.js';
import {AuthProvider} from './features/auth/AuthProvider.jsx';
createRoot(document.getElementById('root')).render(<React.StrictMode><Provider store={store}><AuthProvider><App/></AuthProvider></Provider></React.StrictMode>);
