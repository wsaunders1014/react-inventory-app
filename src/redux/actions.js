import {SELECT_CATEGORY,DESELECT_CATEGORY,CHANGE_CANPROGRESS,GO_FORWARD,ADD_ITEM,REMOVE_ITEM,UPDATE_CF,UPDATE_LBS} from './actionTypes';

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
//Pass category key and item obj
export function addItem(cat, item){
  return{
    type:ADD_ITEM,
    payload:{
      item:item,
      cat:cat
    }
  }
}

//Pass category key and item obj
export function removeItem(cat, item){
  return{
    type:REMOVE_ITEM,
    payload:{
      item:item,
      cat:cat
    }
  }
}
export function updateCF(cf){
  return{
    type:UPDATE_CF,
    cf:cf

  }
}
export function updateLBS(lbs){
  return{
    type:UPDATE_LBS,
    lbs:lbs

  }
}
