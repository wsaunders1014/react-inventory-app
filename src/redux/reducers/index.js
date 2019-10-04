import produce from "immer";
import {SELECT_CATEGORY,DESELECT_CATEGORY} from '../actionTypes.js';
const initialState = {
page:'Select Categories',
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
export default produce((draft,action) =>{

  // For now, don't handle any actions
  // and just return the state given to us.

  switch(action.type){
    case SELECT_CATEGORY:
      draft.categories[action.key].isSelected = true;
      return draft;
        //Because of immutability concerns, we are not using push or shift here.
      // draft.selectedCategories.push(action.item)
      // draft.categories[action.item].isS


    case DESELECT_CATEGORY:
      draft.categories[action.key].isSelected = false;
      return draft;
    // no default
  }

},initialState);
