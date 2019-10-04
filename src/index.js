import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './app.css';

import ItemList from './items-list.json';

/* COMPONENTS */
import ProgressBar from './components/ProgressBar/ProgressBar.jsx';
import Categories from './components/Categories/Categories.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import EmailForm from './components/EmailForm/EmailForm.jsx';
import SaveButton from './components/SaveButton';
/*REDUX BINDINGS */

import { Provider } from 'react-redux';
import store from './redux/store';


function App(){
    return (
      <div id="wrapper">
        <ProgressBar />
        <div id="content" className="clearfix">
          <Categories />
          <Sidebar />
        </div>
        <div className="clearfix">
          <EmailForm />
          <SaveButton />
        </div>
      </div>
    )
}
// ========================================

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);


/*



*/
