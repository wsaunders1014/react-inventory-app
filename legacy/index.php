<html>
<head>
	<link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>
<?php
	
	// $this->inlineScript()
	// 	 ->appendFile('/js/inventory/jquery-2.1.1.min.js')
	// 	 ->appendFile('/js/script.min.js')
	// 	 ->appendFile('https://maps.googleapis.com/maps/api/js?key=AIzaSyAOAFjKE8xQUWxlVds1COiroKVmYjH8SoM');
// 	$listItemOrder = $inventory->getInventoryItemOrder();
// 	$options = $listItemOrder->toArray() ;
// 	$room_typeOptions = "";
// 	$room_typeArr = array();
// 	$i = 0;
// 	foreach($options as $row) {
// 		$room_typeArr[$i++] = ucfirst($row['category']);
// 		$room_typeOptions .= "<option value='".ucfirst($row['category'])."'>".ucfirst($row['category'])."</option>";
// 	}
	                            
	//$ItemOrder = json_encode($listItemOrder->toArray());
?> 
<div style="min-height:calc(100% - 145px);overflow:visible;width:100%">
	<div id="wrapper">
		<div id="progress-bar" class="clearfix">
			<div class="step active"><div class="select-bg"></div><span>SELECT CATEGORIES</span><img src="img/checkmark.svg"></div>
			<div class="step two"><div class="select-bg"></div><span>LARGE ITEMS</span><img src="img/checkmark.svg"></div>
			<div class="step two"><div class="select-bg"></div><span>ADD BOXES</span><img src="img/checkmark.svg"></div>
			<div class="step three"><div class="select-bg"></div><span>REVIEW INVENTORY</span><img src="img/checkmark.svg"></div>
			<div class="step"><div class="select-bg"></div><span>COMPLETED</span><img src="img/checkmark.svg"></div>
		</div>
		<!-- <h3>Please <bold>select</bold> the categories that apply to your move.</h3> -->
		<div id="content" class="clearfix">
			<div id="categories" class="main">
				<div class="heading cancelSelect">Please <bold>select</bold> the categories that apply to your move.</div>
				<div class="overflow">
					<div id="cat-holder" class="holder clearfix">
						
					</div>
				</div>
			</div>
			<div id="sidebar" class="sidebar">
				<div class="wrapper">
					<div class="heading cancelSelect">Your Categories</div>
					<div class="overflow">
						<div id="ul-holder" class="holder">
							<ul>
								
							</ul>
						</div>
					</div>
					<div class="status-bar" style="bottom: -47px">
						<span>TOTAL ITEMS:</span><span id="total-items" class="bolded">0</span>
					</div>
				</div>
				<div class="back-btn"></div>
			</div>
			<div id="items" class="main">
				<div class="heading cancelSelect"><span>All Items</span>
					<div class="search-bar">
						<input type="text" id="search" placeholder="Search for Item..." autocomplete="off" />
						<div id="search-image" class="search"></div>
						<div id="search-results" class="search">
							<ul>
								
							</ul>
						</div>
					</div>
				</div>
				<div class="overflow">
					<div id="items-holder" class="holder">
					</div>
				</div>
				<div class="status-bar">
					<div id="item-weight">APPROX WEIGHT: <span class="bolded">0 lbs.</span></div>
					<div id="item-vol">APPROX VOL.: <span class="bolded">0 CF</span></div>
					<div class="next">Next Category: <span id="next-cat"> Sofas ></span></div>
				</div>
			</div>
			<div id="boxes-main" class="main">
				<div class="heading cancelSelect">Please <bold>select</bold> the boxes that apply to your move.</div>
				<div class="overflow">
					<div id="main-holder" class="holder clearfix">
						
					</div>
				</div>
			</div>
			<div id="boxes-sidebar" class="sidebar">
				<div class="wrapper">
					<div class="heading cancelSelect">Added Boxes</div>
					<div class="overflow">
						<div id="box-holder" class="holder">
							<ul>
								
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div id="review-main" class="main">
				<div class="overflow">
					<div id="review-holder" class="clearfix">
						
					</div>
				</div>
			</div>
			<div id="review-sidebar" class="sidebar">

				<div>
					<span class="title">TOTAL ITEMS</span>
					<span class="info" id="item-count"><sup></sup></span>
				</div>
				<div>
					<span class="title">APRX. VOL</span>
					<span class="info" id="total-vol"><sup></sup></span>
				</div>
				<div>
					<span class="title">APRX. LBS</span>
					<span class="info" id="total-weight"><sup></sup></span>
				</div>
				<div>
					<div class="quote-title">QUOTE RANGE ESTIMATE</div>
					<div id="quote-range"></div>
				</div>
			</div>
			<div id="completed-heading" class="done">
				<h2>Thanks for submitting your inventory.</h2>
			</div>
			<div id="completed-subheading" class="done">
				<h4>Remember, you can always come back and update your list.</h4>
			</div>
			<div id="completed-box" class="done clearfix">
				<div class="subbox"><div class="big">178</div><div class="small"> ITEMS</div></div>
				<div class="subbox clickable" id="download-btn"><a href="/download"><img src="img/download.svg"><div class="small">DOWNLOAD<br/>INVENTORY</div></a></div>
				<!-- <div class="subbox" id="email-btn"><img src="img/email-sent.svg"><div class="small" id="email-text">EMAIL<br/>SENT</div></div> -->
			</div>
			<div id="email-confirm" class="done">
				<div id="email-preface">YOUR INVENTORY WAS SENT TO:</div>
				<span class="email-counter"></span>
				<div id="user-email2"></div>
			</div>
			<div id="comments" class="done">
				How was your experience? Was this site easy to use?<br/>
				<form action="#">
					<textarea name="feedback" id="feedback" placeholder="Enter feedback..."></textarea>
					<button class="cta" type="submit" id="btn_feedback">SUBMIT FEEDBACK</button>
				</form>
			</div>
			<div id="back-btn"></div>
		</div>
		<div class="clearfix">
			<div class="email-container">
				<span class="email-counter"></span>
				<input type="text" id="user-email" class="user-email" placeholder="ENTER EMAIL" maxlength="40" name="user-email" value="<?php echo (isset($inventory->email_address) && !empty($inventory->email_address)) ? $inventory->email_address : $lead->email_address ; ?>"><br/>
				<div class="checkbox">
					<div class="squaredTwo">
						<input type="checkbox" id="terms" name="terms" value="agree" checked/><label for="terms"></label> 
					</div>
				</div>
				<div class="label">Save and email me a copy of my inventory list.</div>
			</div>
			<div id="save-button" class="to-items cta">CONTINUE<span>Your selections have been saved!</span></div>
		</div>
	</div>
	<input type="hidden" name="zip_from" id="zip_from" value="<?php echo $lead->zip_from ; ?>" />
	<input type="hidden" name="zip_to" id="zip_to" value="<?php echo $lead->zip_to ; ?>" />
	<input type="hidden" name="number_of_rooms" id="number_of_rooms" value="<?php echo $lead->number_of_rooms ; ?>" />
	<div id="popup" class="link">
		
	</div>
</div>
<section class="modal">
   	<div class="modal-box">
   			<h4>Need More Time?</h4>
   			<p>
				Your session will expire in 15 seconds of inactivity. Would you like to continue?
				</p>
   			<div class="btn" id="continue">CONTINUE</div>
   			<div class="btn" id="cancel">I'M DONE</div>
   		</div>
   	</div>
</section>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
<script src="js/script.js"></script>
</body>
</html>