import React from 'react';
import './SearchBar.css';
function SearchBar(props){

  return(
    <div id="search-bar">
      <input type="text" id="search" placeholder="Search for Item..." autoComplete="off" />
      <div id="search-image" className="search"></div>
      <div id="search-results" className="search">
        <ul>

        </ul>
      </div>
    </div>
  )
}
export default SearchBar;
