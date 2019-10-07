import React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import './SaveButton.css';

function SaveButton(props){

  const dispatch = useDispatch();
  let canProgress = useSelector(state => state.canProgress);
  
  if(canProgress)
    return <div id="save-button" className="to-items cta canProgress" onClick={()=>dispatch({type:'GO_FORWARD'})}>CONTINUE<span>Your selections have been saved!</span></div>
  else {
    return <div id="save-button" className="to-items cta">CONTINUE<span>Your selections have been saved!</span></div>
  }
}
export default SaveButton;
