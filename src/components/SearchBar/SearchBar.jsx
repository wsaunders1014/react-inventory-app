import React from 'react';
import {connect} from 'react-redux';
import './SearchBar.css';
import ItemList from '../../items-list.json';
import {spaceRemove} from '../../util/helpers.js'
import {addItem} from '../../redux/actions.js'
class SearchBar extends React.Component{
  constructor(props){
    super(props);
    this.state={
      value:"",
      items:ItemList,
      results:[],
      searchImage:"",
      showResults:false
    }


  }

  searchItems = (value,items) =>{

    let pattern = new RegExp(value,"gi");

    let returnedItems = Object.keys(items).filter((currVal)=>{
      let name = items[currVal].item_name;
      if(pattern.test(name)){
        return items[currVal];
      }else
        return false;
    })
  
    this.setState({results:returnedItems});
  }
  handleChange = (e) =>{
    this.setState({value:e.target.value})
    //Search ItemsList for items based on at least 3 characters
    if(e.target.value.length > 2){
      this.searchItems(e.target.value,ItemList);
    }else {
      this.setState({results:[],searchImage:""})
    }
  }
  handleMouseOver = (e) =>{
    //Adds mousedover item image to state to display.
    let id = e.target.getAttribute('data-id');

    let image;
    if(ItemList[id].image===true)
        image = spaceRemove(ItemList[id].item_name)+'.png';
    else if(ItemList[id].image==="")
        image = 'coming-soon.png';
    else
        image = ItemList[id].image;

    image = image.toLowerCase();
    this.setState({searchImage:image})

  }
  //Basically if user presses enter while typing we stop it
  handleSubmit = (e) =>{
    e.preventDefault();
  }
  //IF user clicks on a result, add item.
  handleResultClicked = (e) =>{
    let itemID = e.target.getAttribute('data-id');
    this.props.dispatch(addItem(ItemList[itemID].category,ItemList[itemID].item_name))
  }
  handleKeyDown =(e)=>{
    //Only run if there are results, otherwise ERROR
    if(this.state.results.length > 0){
      let el = document.getElementById('search-results').querySelector('.selected');
      switch(e.key){
        case "ArrowDown":
          //Make sure next sibling exists.
          if(el.nextElementSibling){
            el.classList.remove('selected')
            el.nextElementSibling.classList.add('selected');
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if(el.previousElementSibling){
            el.classList.remove('selected')
            el.previousElementSibling.classList.add('selected');
          }
          break;
        case "Enter":
          if(this.state.results.length > 0){
            //get selected item
            let el = document.getElementById('search-results').querySelector('.selected');
            let itemID = el.getAttribute('data-id')

            //pass category key and item name of currently "selected search result"
            this.props.dispatch(addItem(ItemList[itemID].category,ItemList[itemID].item_name))
          }
          break;
        default:
          break;
      }
    }
  }
  render(){
    return(
      <div id="search-bar" onMouseEnter={()=>{this.setState({showResults:true})}} onMouseLeave={()=>{ this.setState({showResults:false})}}>
        <input type="text" id="search" placeholder="Search for Item..." autoComplete="off" value={this.state.value}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          onKeyDown={this.handleKeyDown}
        />
        {this.state.searchImage !=="" && this.state.showResults &&
          <div id="search-image" className="search" style={{backgroundImage:`url(img/items/${this.state.searchImage})`}}></div>
        }
        {this.state.results.length > 0 && this.state.showResults &&
          <div id="search-results" className="search">
            <ul>
                {
                  this.state.results.map((currVal,index)=>{
                    let item = ItemList[currVal];
                    console.log(item)
                    return (<li key={'search-'+item.item_name} className={(index===0) ? "selected":""} data-id={currVal} onMouseOver={this.handleMouseOver} onClick={this.handleResultClicked}>
                      {item.item_name}
                    </li>)
                  })
                }
            </ul>
          </div>
        }
      </div>
    )
  }
}

export default connect(null,null)(SearchBar);

// BUG: Still getting an error from "let el = document.getElementById('search-results').querySelector('.selected');" not sure why, but sometimes there is no selected even if the results array is not empty
