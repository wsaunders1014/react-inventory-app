import React from 'react';
import './Categories.css';

class Categories extends React.Component{
  render(){
    console.log(this.props.categories);
    let keys = Object.keys(this.props.categories);
    return (
      <div id="categories" className="main">
        <div className="heading cancelSelect">Please <span className="bold">select</span> the categories that apply to your move.</div>
        <div id="cat-holder" className="holder clearfix">
          {
            keys.map((item,index)=>{
              let x = -(133 * (index%4));
              let y = -(133 * Math.floor(index/4));

              if(item != 'Boxes'){
                return (
                  <div id={nameHelper(item)} className="item">
                    <div className="img" style={{backgroundPosition: x+'px '+y+'px'}}></div>
                    <div className="bottom">
                      <h4 className="cancelSelect">{item}</h4>
                    </div>
                  </div>
                )
              }

            })

          }
        </div>
      </div>
    );
  }
}
//Removes spaces and characters from category names
const nameHelper = (name) => {
  return name.replace('& ','').split(' ').join('_');
}
export default Categories;
