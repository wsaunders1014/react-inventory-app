import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './app.css';

import ItemList from './new-item-list.json';


/* COMPONENTS */
import ProgressBar from './components/ProgressBar/ProgressBar.jsx';
import Categories from './components/Categories/Categories.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import EmailForm from './components/EmailForm/EmailForm.jsx';
import SaveButton from './components/SaveButton';
import Items from './components/Items';
/*REDUX BINDINGS */

import { Provider,useSelector } from 'react-redux';
import store from './redux/store';

function App(){
    let nav = useSelector(state=>state.pageIndex);
    useEffect(()=>{


      if(nav.pageIndex === 1){
        //Animate Categories box out.
         document.getElementById('categories').classList.add('animate-categories-out');
         //Animates Sidebar to the left side and reveals some inner divs.
         document.getElementById('sidebar').classList.add('animate-to-step2');

         setTimeout(function(){
            document.getElementById('categories').style.display = 'none';
            document.getElementById('items').classList.add('animate-in');
         },500)

      }else if(nav.pageIndex === 2){

      }
    })
    return (
      <div id="wrapper">
        <ProgressBar />
        <div id="content" className="clearfix">

          <Categories/>
          <Sidebar pageIndex={nav.pageIndex}/>
          {nav.pageIndex > 0 &&
            <Items itemList={ItemList}/>
          }
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
Depending on pageIndex, animate elemnts


*/
