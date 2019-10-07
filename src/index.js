import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group'
import './index.css';
import './app.css';
import ItemList from './structuredItems.json';


/* COMPONENTS */
import ProgressBar from './components/ProgressBar';
import Categories from './components/Categories';
import Sidebar from './components/Sidebar';
import EmailForm from './components/EmailForm';
import SaveButton from './components/SaveButton';
import ItemsView from './components/ItemsView';
//import Boxes from './components/Boxes/Boxes.jsx';
//import BoxesSidebar from './components/BoxesSidebar/BoxesSidebar.jsx'
/*REDUX BINDINGS */

import { Provider,useSelector, useDispatch } from 'react-redux';
import store from './redux/store';

function App(){
    let nav = useSelector(state=>state.pageIndex);
    let [currentCat,setCurrentCat] = useState(0);
    const dispatch = useDispatch();

    return (
      <div id="wrapper">
        <ProgressBar pageIndex={nav.pageIndex} />

        <div id="content" className="clearfix">

          <CSSTransition
            in={(nav.pageIndex ===0) ? true : false}
            timeout={{appear:500,enter:500,exit:500}}
            unmountOnExit
            classNames="categories"
            appear
          >
            <Categories pageIndex={nav.pageIndex}/>
            </CSSTransition>

          <CSSTransition
            in={(nav.pageIndex ===0 || nav.pageIndex===1) ? true : false}
            timeout={{enter:500,exit:500}}
            unmountOnExit
            appear
            classNames="sidebar-anim"
          >
            <Sidebar id="category-sidebar" classes={(nav.pageIndex < 1) ? "category-sidebar":"items-sidebar"} pageIndex={nav.pageIndex} currentCat={currentCat} setCurrentCat={setCurrentCat} />

          </CSSTransition>


          <CSSTransition
            in={(nav.pageIndex ===1 ) ? true : false}
            timeout={{enter:500,exit:5000}}
            unmountOnExit
            classNames="items"
          >
            <ItemsView itemList={ItemList} currentCat={currentCat} setCurrentCat={setCurrentCat}/>
          </CSSTransition>
            {nav.pageIndex > 1 &&
              <>
              {//<Sidebar id="boxes-sidebar" boxItems={ItemList['Boxes']}/>
              //<Boxes boxItems={ItemList['Boxes']}/>
            }
              </>
            }
            {nav.pageIndex > 0 &&
              <div id="back-btn" onClick={()=>{
                  dispatch({type:"GO_BACK"})
                }}></div>
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

// TODO: I think i'm going to need to extract side bar and main window "structure" into COMPONENTS
// TODO: Need to set "completed status" for progress bar steps.
