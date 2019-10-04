import { combineReducers } from 'redux-immer';
import produce from "immer";
import {SELECT_CATEGORY,DESELECT_CATEGORY,CHANGE_CANPROGRESS,GO_FORWARD} from '../actionTypes.js';
const initialState = {
pages:['Select Categories','Large Items','Add Boxes','Review Inventory','Completed'],
pageIndex:0,
canProgress:false,
categories:{
    "Sofas & Couches": {isSelected:false, "items": [false], "total": 0, "itemCount": [false], "sub_categories": [false]},
    "Dressers & Cabinets": {isSelected:false, "items": [false], "total": 0, "itemCount": [false], "sub_categories": [false, "Dining", "Office", "Bedroom", "Entertainment"]},
    "Tables & Chairs": {isSelected:false, "items": [false], "total": 0, "itemCount": [false], "sub_categories": [false, "Dining", "Coffee & End Tables", "Living Room", "Office", "Patio", "Other"]},
    "Desks": {isSelected:false, "items": [false], "total": 0, "itemCount": [false], "sub_categories": [false]},
    "Musical Instruments": {isSelected:false, "items": [false], "total": 0, "itemCount": [false], "sub_categories": [false]},
    "TVs & Electronics": {isSelected:false, "items": [false], "total": 0, "itemCount": [false], "sub_categories": [false, "TVs", "Stereos", "Computers", "Office", "Other"]},
    "Appliances": {isSelected:false, "items": [false], "total": 0, "itemCount": [false], "sub_categories": [false, "Kitchen", "Laundry", "Other"]},
    "Bookcases": {isSelected:false, "items": [false], "total": 0, "itemCount": [false], "sub_categories": [false]},
    "Beds & Cribs": {isSelected:false, "items": [false], "total": 0, "itemCount": [false], "sub_categories": [false, "Mattress Only", "Mattress & Box Spring", "Bed Frames", "Futons", "Nursery", "Other"]},
    "Futons": {isSelected:false, "items": [false], "total": 0, "itemCount": [false], "sub_categories": [false]},
    "Children & Nursery": {isSelected:false, "items": [false], "total": 0, "itemCount": [false], "sub_categories": [false]},
    "Lamps & Mirrors": {isSelected:false, "items": [false], "total": 0, "itemCount": [false], "sub_categories": [false]},
    "Motorcycles & ATVs": {isSelected:false, "items": [false], "total": 0, "itemCount": [false], "sub_categories": [false]},
    "Tools": {isSelected:false, "items": [false], "total": 0, "itemCount": [false], "sub_categories": [false]},
    "Sports & Hobbies": {isSelected:false, "items": [false], "total": 0, "itemCount": [false], "sub_categories": [false]},
    "Miscellaneous": {isSelected:false, "items": [false], "total": 0, "itemCount": [false], "sub_categories": [false]},
    "Boxes": {isSelected:false, "items": [false], "total": 0, "itemCount": [false], "sub_categories": [false]}
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
    default:
      return state;
  }
}
const combinedReducer = combineReducers(produce,{categories:categoriesReducer,canProgress:progressReducer,pageIndex:pageReducer})

export default combinedReducer;
