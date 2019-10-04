import {SELECT_CATEGORY,DESELECT_CATEGORY,CHANGE_CANPROGRESS,GO_FORWARD} from './actionTypes';

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
export function changeCanProgress(boolean){
  return{
    type:CHANGE_CANPROGRESS,
    boolean
  }
}

export function goForward(){
  return{
    type:GO_FORWARD,

  }
}
