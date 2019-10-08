import React from 'react';
import './MainContainer.css';

import StatusBar from '.././StatusBar';

function MainContainer(props){

  return(

    <div id={props.divID} className="main" style={props.style}>


        { props.children }

      <StatusBar />
    </div>

  )
}
export default MainContainer;
