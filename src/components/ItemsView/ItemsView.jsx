import React from 'react';
import {useSelector} from 'react-redux';
import Item from '../Item';
import './ItemsView.css';
import SearchBar from '.././SearchBar';
import {spaceRemove} from '../../util/helpers.js';
//import {addItem,removeItem,updateCF,updateLBS} from '../../redux/actions.js';
function ItemsView(props){
//  console.log(props);
  let currentCategoryIndex = useSelector(state=>state.currentCategoryIndex);
  let currentCategory = props.selectedCategories[currentCategoryIndex]
  console.log(currentCategoryIndex,currentCategory)



  //Grab the categories object from the store. We will be adding items to its subarray
  const categories = useSelector(state=>state.categories);
  //console.log(categories)
  //console.log(props.itemList[currentCategory])
  return(
    <>
    <div className="heading cancelSelect">
      <span>{currentCategory}</span>
      <SearchBar />
    </div>
    <div className="holder">
      {
        categories[currentCategory].hasSubCategories &&
          Object.keys(props.itemList[currentCategory]).map((currVal,index)=>{
              return (<Subcategory
                key={currVal}
                subcat={currVal}
                category={currentCategory}
                hasSubCategories={categories[currentCategory].hasSubCategories}
                items={props.itemList[currentCategory]}
                />
              )
          })
        }
        {!categories[currentCategory].hasSubCategories &&
           <Subcategory
            category={currentCategory}
            hasSubCategories={categories[currentCategory].hasSubCategories}
            items={props.itemList[currentCategory]}
            />
        }


    </div>
    </>
   )

}
//Iterates through array and loads the selected categories into array.



function Subcategory(props){
  if(props.hasSubCategories){ //Render items into subcategory divs with headings, else just render the list
    return(
      <div className="sub-cat" id={"subcat-"+props.subcat}>
        <div className="sub-heading">{props.subcat.split('_').join(' ')}</div>
        <div className="items-container clearfix">
            {
              Object.keys(props.items[props.subcat]).map((currVal,index)=>{
                let item = props.items[props.subcat][currVal];
                return <Item key={spaceRemove(currVal)} category={props.category} {...item} />
              })
            }
        </div>
      </div>
    )
  }else{
    return (
      <div className="items-container clearfix">
          {
            Object.keys(props.items).map((currVal,index)=>{
              let item = props.items[currVal];
              return <Item key={spaceRemove(currVal)} category={props.category} {...item} />
            })
          }
      </div>
    )
  }
}
export default ItemsView;



// TODO: Need to add children to menu for items.
