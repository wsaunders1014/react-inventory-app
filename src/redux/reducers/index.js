import { combineReducers } from 'redux-immer';
import produce from "immer";
import {SELECT_CATEGORY,DESELECT_CATEGORY,CHANGE_CANPROGRESS,GO_FORWARD,ADD_ITEM,REMOVE_ITEM,GO_BACK,UPDATE_CF,UPDATE_LBS} from '../actionTypes.js';
const initialState = {
pages:['Select Categories','Large Items','Add Boxes','Review Inventory','Completed'],
pageIndex:0,
canProgress:true,
categories:{
    "Sofas & Couches": {isSelected:true, "itemKeys": [], "itemCount": [],"itemObj":[] },
    "Dressers & Cabinets": {isSelected:false, "itemKeys": [], "itemCount": [],"itemObj":[]},
    "Tables & Chairs": {isSelected:false, "itemKeys": [], "itemCount": [],"itemObj":[]},
    "Desks": {isSelected:false, "itemKeys": [], "itemCount": [],"itemObj":[]},
    "Musical Instruments": {isSelected:false, "itemKeys": [], "itemCount": [],"itemObj":[]},
    "TVs & Electronics": {isSelected:false, "itemKeys": [], "itemCount": [],"itemObj":[]},
    "Appliances": {isSelected:false, "itemKeys": [], "itemCount": [],"itemObj":[] },
    "Bookcases": {isSelected:false, "itemKeys": [], "itemCount": [],"itemObj":[]},
    "Beds & Cribs": {isSelected:false, "itemKeys": [], "itemCount": [],"itemObj":[]},
    "Futons": {isSelected:false, "itemKeys": [], "itemCount": [],"itemObj":[]},
    "Children & Nursery": {isSelected:false, "itemKeys": [], "itemCount": [],"itemObj":[]},
    "Lamps & Mirrors": {isSelected:false, "itemKeys": [], "itemCount": [],"itemObj":[]},
    "Motorcycles & ATVs": {isSelected:false, "itemKeys": [], "itemCount": [],"itemObj":[]},
    "Tools": {isSelected:false, "itemKeys": [], "itemCount": [],"itemObj":[]},
    "Sports & Hobbies": {isSelected:false, "itemKeys": [], "itemCount": [],"itemObj":[]},
    "Miscellaneous": {isSelected:false, "itemKeys": [], "itemCount": [],"itemObj":[]},
    "Boxes": {isSelected:false, "itemKeys": [], "itemCount": [], "itemObj":[]}
  },
  stats:{
    cf:0,
    lbs:0
  }
}
const categoriesReducer = (state=initialState.categories,action) =>{
  let category;
  switch(action.type){
    case SELECT_CATEGORY:
      state[action.key].isSelected = true;
      return state;

    case DESELECT_CATEGORY:
      state[action.key].isSelected = false;
      return state;
    case ADD_ITEM:
       category = state[action.payload.cat];
      //If item added from searchbar, category may not be selected so we select it automatically
      category.isSelected = true;
      //check if item exists in category.items array FIRST
      if(category.itemKeys.indexOf(action.payload.item.name) === -1){

        //Item DOES NOT EXIST so we add it to item array of category
        category.itemKeys.push(action.payload.item.name)
        category.itemObj.push(action.payload.item)
        //make sure itemCount array syncs up, itemCount index == item index
        category.itemCount.push(1);
      }else{
        //Add one to itemCount at item index
        category.itemCount[category.itemKeys.indexOf(action.payload.item.name)]++;
      }
      return state;
    case REMOVE_ITEM:
         category= state[action.payload.cat];

        let itemIndex = category.itemKeys.indexOf(action.payload.item.name);
        //check if it's OWNED, we only need to do something if it's owned.
        if(itemIndex !== -1){
          category.itemCount[itemIndex]--;
            if( category.itemCount[itemIndex]<1){
              category.itemCount.splice(itemIndex,1)
              category.itemKeys.splice(itemIndex,1);
              category.itemObj.splice(itemIndex,1);
            }
        }
      return state;
    default:
      return state;
  }

};
const statsReducer = (state = initialState.stats, action) =>{
  switch(action.type){
    //if an item is removed, then cf/lbs will be passed with a '-' at dispatch.
    case UPDATE_CF:
      state.cf += action.cf;
      return state;
    case UPDATE_LBS:
      state.lbs += action.lbs;
      return state;
    default:
      return state;
  }
}
const progressReducer = (state = initialState.canProgress,action)=>{
  switch(action.type){
    case CHANGE_CANPROGRESS:
      state = action.boolean
      return state;
    default:
      return state;
  }
}
const pageReducer = (state = {pages:initialState.pages,pageIndex:initialState.pageIndex}, action) =>{
  switch (action.type) {
    case GO_FORWARD:
      state.pageIndex++;
      return state;
    case GO_BACK:
      state.pageIndex--;
      return state;
    default:
      return state;
  }
}
const combinedReducer = combineReducers(produce,{categories:categoriesReducer,canProgress:progressReducer,pageIndex:pageReducer,stats:statsReducer})

export default combinedReducer;
