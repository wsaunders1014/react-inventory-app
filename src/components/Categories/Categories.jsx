import React from 'react';
import { connect } from 'react-redux';
import './Categories.css';
import {selectCategory,changeCanProgress} from '../../redux/actions.js';
import {spaceRemove,spaceAdder} from '../../util/helpers.js';
function Categories(props){
    // if(props.pageIndex !==0){
    //   return null
    // }else{
      let keys = Object.keys(props.categories);

      const handleSelectCategory = (e) =>{
        let key = spaceAdder(e.target.getAttribute('id'));
        e.target.className="item animate-out";
        setTimeout(()=>{
          props.dispatch(selectCategory(key))
          props.dispatch(changeCanProgress(true))
        },500)

      }
      return (

        <div id="categories" className="main" style={props.style}>
          <div className="heading cancelSelect">Please <span className="bold">select</span> the categories that apply to your move.</div>
          <div id="cat-holder" className="holder clearfix">
            {
              keys.map((item,index)=>{
                let x = -(133 * (index%4));
                let y = -(133 * Math.floor(index/4));

                if(item !== 'Boxes' && props.categories[item].isSelected === false){
                  return (
                    <div id={spaceRemove(item)} className="item animate-in"
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
  //  }
}
function mapStateToProps(state){
  return {
    categories:state.categories
  }
}


export default connect(mapStateToProps)(Categories);
