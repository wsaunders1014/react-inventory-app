import React from 'react';
import {useSelector} from 'react-redux';
import './Boxes.css';
import {selectCategory,changeCanProgress} from '../../redux/actions.js';
import {spaceRemove,spaceAdder} from '../../util/helpers.js';
function Boxes(props){

  //const boxes = useSelector(state => state.categories['Boxes'])
  let keys = Object.keys(props.itemList['Boxes']);
  console.log(keys);
  console.log(props)
  return(
    <div id="boxes" className="main animate-in">
      <div className="heading cancelSelect">Please <span className="bold">select</span> the boxes that apply to your move.</div>
      <div className="overflow">
        <div id="main-holder" className="holder clearfix">
          {
            keys.map((item,index) => {
              let x = -(133 * (index%4));
              let y = -(133 * Math.floor(index/4));

              let image = props.itemList['Boxes'][item].image;
              if(image===true){
                image = spaceRemove(item)+'.png';
              }
              console.log(image)
              return (
                <div id={spaceRemove(item)} className="item animate-in"
               key={spaceRemove(item)}>
                  <div className="img" style={{background:`url(img/items/${image}) no-repeat 50%`}}></div>
                  <div className="bottom">
                    <h4 className="cancelSelect">{item}</h4>
                  </div>
                </div>
              )


          })

        }
        </div>
      </div>
    </div>
  )
}
export default Boxes;
