import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './app.css';
import ItemList from './items-list.json';
import ProgressBar from './components/ProgressBar/ProgressBar.jsx';
import Categories from './components/Categories/Categories.jsx';
var app = document.getElementById('app');

class App extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      activeCats:[],
      categories:{
        "Sofas & Couches": {"items": [false], "total": 0, "isActive": false, "itemCount": [false], "sub_categories": [false]},
        "Dressers & Cabinets": {"items": [false], "total": 0, "isActive": false, "itemCount": [false], "sub_categories": [false, "Dining", "Office", "Bedroom", "Entertainment"]},
        "Tables & Chairs": {"items": [false], "total": 0, "isActive": false, "itemCount": [false], "sub_categories": [false, "Dining", "Coffee & End Tables", "Living Room", "Office", "Patio", "Other"]},
        "Desks": {"items": [false], "total": 0, "isActive": false, "itemCount": [false], "sub_categories": [false]},
        "Musical Instruments": {"items": [false], "total": 0, "isActive": false, "itemCount": [false], "sub_categories": [false]},
        "TVs & Electronics": {"items": [false], "total": 0, "isActive": false, "itemCount": [false], "sub_categories": [false, "TVs", "Stereos", "Computers", "Office", "Other"]},
        "Appliances": {"items": [false], "total": 0, "isActive": false, "itemCount": [false], "sub_categories": [false, "Kitchen", "Laundry", "Other"]},
        "Bookcases": {"items": [false], "total": 0, "isActive": false, "itemCount": [false], "sub_categories": [false]},
        "Beds & Cribs": {"items": [false], "total": 0, "isActive": false, "itemCount": [false], "sub_categories": [false, "Mattress Only", "Mattress & Box Spring", "Bed Frames", "Futons", "Nursery", "Other"]},
        "Futons": {"items": [false], "total": 0, "isActive": false, "itemCount": [false], "sub_categories": [false]},
        "Children & Nursery": {"items": [false], "total": 0, "isActive": false, "itemCount": [false], "sub_categories": [false]},
        "Lamps & Mirrors": {"items": [false], "total": 0, "isActive": false, "itemCount": [false], "sub_categories": [false]},
        "Motorcycles & ATVs": {"items": [false], "total": 0, "isActive": false, "itemCount": [false], "sub_categories": [false]},
        "Tools": {"items": [false], "total": 0, "isActive": false, "itemCount": [false], "sub_categories": [false]},
        "Sports & Hobbies": {"items": [false], "total": 0, "isActive": false, "itemCount": [false], "sub_categories": [false]},
        "Miscellaneous": {"items": [false], "total": 0, "isActive": false, "itemCount": [false], "sub_categories": [false]},
        "Boxes": {"items": [false], "total": 0, "isActive": false, "itemCount": [false], "sub_categories": [false]}}
    }
  }
  render(){
    return (
      <div id="wrapper">
        <ProgressBar />
        <div id="content" className="clearfix">
          <Categories categories={this.state.categories}/>
        </div>
      </div>
    )
  }
}
// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);


/*



*/
