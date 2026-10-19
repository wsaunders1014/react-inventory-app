import React from 'react';
import './MainContainer.css';

import StatusBar from '.././StatusBar/StatusBar.jsx';

function MainContainer(props){

  return(

    <div ref={props.ref} id={props.divID} className="main" style={props.style}>


        { props.children }

      <StatusBar />
    </div>

  )
}
export default MainContainer;
