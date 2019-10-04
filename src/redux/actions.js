import {SELECT_CATEGORY,DESELECT_CATEGORY} from './actionTypes';

export function selectCategory(key){
  return {
      type:SELECT_CATEGORY,
      key
  }
}
export function deselectCategory(key){
  return{
    type:DESELECT_CATEGORY,
    key
  }
}
