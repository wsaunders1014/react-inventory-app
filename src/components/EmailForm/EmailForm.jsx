import './EmailForm.css';
import React,{ useState } from 'react';
function EmailForm(props){
  let [email,setEmail] = useState({text:'',boxChecked:false})
  function handleChange(e){

    setEmail({text:e.target.value, ...email})
  }
  function handleCheckbox(){
    setEmail({...email,boxChecked:!email.boxChecked})

  }

  return(
    <div id="email-container">
      <form>
				<span className="email-counter"></span>
				<input type="text" id="user-email" className="user-email" placeholder="ENTER EMAIL" maxLength="40" name="user-email" onChange={handleChange} value={email.text}/><br/>
				<div className="checkbox">
					<div className="squaredTwo">
						<input type="checkbox" id="terms" name="terms" value="save" onChange={handleCheckbox} checked={email.boxChecked}/><label htmlFor="terms"></label>
					</div>
				</div>
				<div className="label">Save and email me a copy of my inventory list.</div>
      </form>
		</div>
  )
}
export default EmailForm;
