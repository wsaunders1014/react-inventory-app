import React from 'react';
import './SearchBar.css';
import ItemList from '../../items-list.json';
class SearchBar extends React.Component{
  constructor(props){
    super(props);
    this.state={value:"",items:ItemList,results:[]}
    console.log(this.state.items)
  }
  handleChange = (e) =>{
    this.setState({value:e.target.value})
    //Search ItemsList for items based on at least 3 characters
    if(e.target.value.length >= 2){
      let pattern = new RegExp(e.target.value,"gi");

        let returnedItems = Object.keys(this.state.items).filter((currVal)=>{
          let name = this.state.items[currVal].item_name;
          if(pattern.test(name)){
            return this.state.items[currVal];
          }
        })
        this.setState({results:returnedItems});
    }else {
      this.setState({results:[]})
    }
  }
  handleMouseOver = (e) =>{
    let id = e.target.getAttribute('data-id');
    console.log(id)
  }
  render(){
    return(
      <div id="search-bar">
        <input type="text" id="search" placeholder="Search for Item..." autoComplete="off" onChange={this.handleChange} value={this.state.value} />
        <div id="search-image" className="search"></div>
        {this.state.results.length > 0 &&
          <div id="search-results" className="search">
            <ul>
                {
                  this.state.results.map((currVal)=>{
                    let item = this.state.items[currVal];
                    return <li key={'search-'+item.item_name} data-id={currVal} onMouseOver={this.handleMouseOver}>
                      {item.item_name}
                    </li>
                  })
                }
            </ul>
          </div>
        }
      </div>
    )
  }
}
export default SearchBar;

// TODO: Load image in searc-image on mouseover of LI.
// TODO: Press enter to select currently selected search result, press up/ down to navigate results, and obviously enable mouse click on result. If result from non selected, category, add it to sidebar.
// BUG: Pressing enter while in any input is submitting and causing page to refresh and url to change.
