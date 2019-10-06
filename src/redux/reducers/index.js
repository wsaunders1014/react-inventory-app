import { combineReducers } from 'redux-immer';
import produce from "immer";
import {SELECT_CATEGORY,DESELECT_CATEGORY,CHANGE_CANPROGRESS,GO_FORWARD,ADD_ITEM,REMOVE_ITEM,GO_BACK} from '../actionTypes.js';
const initialState = {
pages:['Select Categories','Large Items','Add Boxes','Review Inventory','Completed'],
pageIndex:0,
canProgress:false,
categories:{
    "Sofas & Couches": {isSelected:false, "items": [], "itemCount": [] },
    "Dressers & Cabinets": {isSelected:false, "items": [], "itemCount": []},
    "Tables & Chairs": {isSelected:false, "items": [], "itemCount": []},
    "Desks": {isSelected:false, "items": [], "itemCount": []},
    "Musical Instruments": {isSelected:false, "items": [], "itemCount": []},
    "TVs & Electronics": {isSelected:false, "items": [], "itemCount": []},
    "Appliances": {isSelected:false, "items": [], "itemCount": [], },
    "Bookcases": {isSelected:false, "items": [], "itemCount": []},
    "Beds & Cribs": {isSelected:false, "items": [], "itemCount": []},
    "Futons": {isSelected:false, "items": [], "itemCount": []},
    "Children & Nursery": {isSelected:false, "items": [], "itemCount": []},
    "Lamps & Mirrors": {isSelected:false, "items": [], "itemCount": []},
    "Motorcycles & ATVs": {isSelected:false, "items": [], "itemCount": []},
    "Tools": {isSelected:false, "items": [], "itemCount": []},
    "Sports & Hobbies": {isSelected:false, "items": [], "itemCount": []},
    "Miscellaneous": {isSelected:false, "items": [], "itemCount": []},
    "Boxes": {isSelected:false, "items": [], "itemCount": []}
  }
}
const categoriesReducer = (state=initialState.categories,action) =>{

  switch(action.type){
    case SELECT_CATEGORY:
      state[action.key].isSelected = true;
      return state;

    case DESELECT_CATEGORY:
      state[action.key].isSelected = false;
      return state;
    case ADD_ITEM:
      //check if item exists FIRST
      if(state[action.payload.cat].items.indexOf(action.payload.item.name) === -1){
        //if not, enter it into items array in category
        state[action.payload.cat].items.push(action.payload.item.name)
        //make sure itemCount array syncs up, itemCount index == item index
        state[action.payload.cat].itemCount.push(1);
      }else{
        //Add one to itemCount at item index
        state[action.payload.cat].itemCount[state[action.payload.cat].items.indexOf(action.payload.item.name)]++;
      }
      return state;
    case REMOVE_ITEM:
      return state;
    default:
      return state;
  }

};

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
const combinedReducer = combineReducers(produce,{categories:categoriesReducer,canProgress:progressReducer,pageIndex:pageReducer})

export default combinedReducer;
