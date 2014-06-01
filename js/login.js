
var fb = new Firebase('https://amber-fire-6558.firebaseio.com');
var auth = new FirebaseSimpleLogin(fb, function (error, user){
	loadContent();
	// if(error){
	// 	console.log("There was an error!!!");
	// 	console.log(error);
	// }
	// else if(user){
	// 	loadContent();
	// }
	// else{
	// 	console.log("no user logged in");
	// 	displayLoginForm();
	// }

});

function loadContent (){
	$.get('inputEvent.html', null, function (mydata, textStatus, jqXHR){
		$("#main-content").html(mydata);
	});
}

function displayLoginForm(){
	var formHTML = '<form class="form-horizontal" role="form" onsubmit="window.mylogin()">\
				    <div class="form-group">\
				      <label for="inputEmail3" class="col-sm-2 control-label">Email</label>\
				      <div class="col-sm-5">\
				        <input type="email" class="form-control" id="inputEmail3" placeholder="Email">\
				      </div>\
				    </div>\
				    <div class="form-group">\
				      <label for="inputPassword3" class="col-sm-2 control-label">Password</label>\
				      <div class="col-sm-5">\
				        <input type="password" class="form-control" id="inputPassword3" placeholder="Password">\
				      </div>\
				    </div>\
				    <div class="form-group">\
				      <div class="col-sm-offset-2 col-sm-10">\
				        <button id="submitButton" type="submit" class="btn btn-default">Sign in</button>\
				      </div>\
				    </div>\
				  </form>';

	$( "#main-content" ).html(formHTML);			  

}

var mylogin = function (){
	console.dir(window.auth);
   	var user_email = $('#inputEmail3').val();
   	var user_password = $('#inputPassword3').val();
console.log(user_email, user_password);
   	window.auth.login('password', {
  	  email: user_email,
  	  password: user_password
  	});
}

