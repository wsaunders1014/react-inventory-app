import React from 'react';
import { connect } from 'react-redux';
import './Categories.css';
import {selectCategory} from '../../redux/actions.js';
function Categories(props){

    let keys = Object.keys(props.categories);

    const handleSelectCategory = (e) =>{
      let key = spaceAdder(e.target.getAttribute('id'));
      props.dispatch(selectCategory(key))
    }
    return (
      <div id="categories" className="main">
        <div className="heading cancelSelect">Please <span className="bold">select</span> the categories that apply to your move.</div>
        <div id="cat-holder" className="holder clearfix">
          {
            keys.map((item,index)=>{
              let x = -(133 * (index%4));
              let y = -(133 * Math.floor(index/4));

              if(item !== 'Boxes' && props.categories[item].isSelected === false){
                return (
                  <div id={spaceRemove(item)} className="item"
                  onClick={handleSelectCategory} key={spaceRemove(item)}>
                    <div className="img" style={{backgroundPosition: x+'px '+y+'px'}}></div>
                    <div className="bottom">
                      <h4 className="cancelSelect">{item}</h4>
                    </div>
                  </div>
                )
              }else{
                return false;
              }

            })

          }
        </div>
      </div>
    );

}
function mapStateToProps(state){
  return {
    categories:state.categories
  }
}

//Removes spaces and characters from category names
const spaceRemove = (name) => {
  return name.split(' ').join('_');
}
const spaceAdder = (name) =>{
  return name.split('_').join(' ');
}
export default connect(mapStateToProps)(Categories);
