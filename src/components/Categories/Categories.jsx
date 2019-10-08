import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import './Categories.css';
import {selectCategory,changeCanProgress} from '../../redux/actions.js';
import {spaceRemove,spaceAdder} from '../../util/helpers.js';
function Categories(props){

  const dispatch = useDispatch();
  const categories = useSelector(state => state.categories)
  //const currentCategory = useSelector(state =>state.currentCategory)
  let keys = Object.keys(categories);

  const handleSelectCategory = (e) =>{
    let key = spaceAdder(e.currentTarget.getAttribute('id'));
    props.setSelectedCategories([...props.selectedCategories,key])
    e.currentTarget.className="item animate-out";
    setTimeout(()=>{
      dispatch(selectCategory(key))
      dispatch(changeCanProgress(true))
    },500)

  }
  return(
    <>
    <div className="heading cancelSelect">
      <span>Please <span className='bold'>select</span> the categories that apply to your move.</span>
    </div>
    <div className="holder">
      {keys.map((item,index)=>{
          let x = -(133 * (index%4));
          let y = -(133 * Math.floor(index/4));

          if(item !== 'Boxes' && categories[item].isSelected === false){
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
    </>
  )

}

export default Categories;
