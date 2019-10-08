import React,{useState} from 'react';
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
import MainContainer from './components/MainContainer';
//import Boxes from './components/Boxes/Boxes.jsx';
//import BoxesSidebar from './components/BoxesSidebar/BoxesSidebar.jsx'
/*REDUX BINDINGS */
import {changeCurrentCategory} from './redux/actions.js';
import { Provider,useSelector, useDispatch } from 'react-redux';
import store from './redux/store';
function App(){
    let nav = useSelector(state=>state.pageIndex);
    let [selectedCategories, setSelectedCategories] = useState([])

    const dispatch = useDispatch();
    //console.log(context);
    //I can't stand the "new line for every prop" on components, and it's also not feasible to keep them on the same line, so i'm just storing them here so the components keep looking clean ;)
    const categoryProps = {
        divID:"categories",
        style:{}
    }
    const categoryTransition = {
      in:nav.pageIndex === 0 ? true : false,
      timeout:500,
      unmountOnExit:true,
      classNames:"categories",
      appear:true
    }
    const sidebarTransition = {
      in:nav.pageIndex === 0 || nav.pageIndex===1 ? true : false,
      timeout:500,
      unmountOnExit:true,
      appear:true,
      classNames:"sidebar-anim"
    }
    const itemsTransition ={
      in:nav.pageIndex === 1  ? true : false,
      timeout:500,
      unmountOnExit:true,
      classNames:"items"
    }
    return (

      <div id="wrapper">
        <ProgressBar pageIndex={nav.pageIndex} />

        <div id="content" className="clearfix">



              <CSSTransition {...categoryTransition}>
                <MainContainer {...categoryProps}>
                  <Categories pageIndex={nav.pageIndex} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}/>
                </MainContainer>
              </CSSTransition>


              <CSSTransition {...sidebarTransition}>
                <Sidebar id="category-sidebar" selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} classes={(nav.pageIndex < 1) ? "category-sidebar":"items-sidebar"} pageIndex={nav.pageIndex}  />
              </CSSTransition>


              <CSSTransition {...itemsTransition}>
                <MainContainer divID="items" style={{}}>
                  <ItemsView itemList={ItemList} selectedCategories={selectedCategories} />
                </MainContainer>
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
                dispatch(changeCurrentCategory(0))
                dispatch({type:"GO_BACK"})

                }}></div>
            }
        </div>
        <div className="clearfix">
          <EmailForm />
          <SaveButton />
        </div>


        <div id="bottom-banner"><a href="https://github.com/wsaunders1014/react-inventory-app">SEE THE SOURCE CODE ON GITHUB</a></div>
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
