import {SELECT_CATEGORY,DESELECT_CATEGORY,CHANGE_CANPROGRESS,GO_FORWARD,ADD_ITEM,REMOVE_ITEM} from './actionTypes';

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
export function addItem(cat, item){
  return{
    type:ADD_ITEM,
    payload:{
      item:item,
      cat:cat
    }
  }
}
export function removeItem(cat, item){
  return{
    type:REMOVE_ITEM,
    payload:{
      item:item,
      cat:cat
    }
  }
}
