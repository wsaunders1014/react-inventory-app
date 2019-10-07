import React from 'react';
import {useSelector} from 'react-redux';
import './Boxes.css';
import {selectCategory,changeCanProgress} from '../../redux/actions.js';
import {spaceRemove,spaceAdder} from '../../util/helpers.js';
import Item from '../Item/Item.jsx';
function Boxes(props){

  //const boxes = useSelector(state => state.categories['Boxes'])
  let keys = Object.keys(props.boxItems);

  return(
    <div id="boxes" className="main animate-in">
      <div className="heading cancelSelect">Please <span className="bold">select</span> the boxes that apply to your move.</div>
      <div className="overflow">
        <div id="main-holder" className="holder clearfix">
          {
            keys.map((item,index) => {



                let itemObj = props.boxItems[item];
                return <Item key={spaceRemove(item)} category='Boxes' {...itemObj} />




          })

        }
        </div>
      </div>
    </div>
  )
}
export default Boxes;
