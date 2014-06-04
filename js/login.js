
var fb = new Firebase('https://amber-fire-6558.firebaseio.com');

var auth = new FirebaseSimpleLogin(fb, function (error, user){
	if(error){
		console.log(error);
		var msg = "";
		switch(error.code) {
		      case 'INVALID_USER': msg = "The specified email address isn't registered as a user."; break;
		      case 'INVALID_EMAIL': msg = "The specified email address is incorrect."; break;
		      case 'INVALID_PASSWORD': msg = "The specified password is incorrect."; break;
		      default: msg = "There was an error loggin in.";
		    }

		alert(msg);
	}
	else if(user){
		loadContent();
	}
	else{
		displayLoginForm();
	}
});

var loginHTML = '<div class="form-horizontal" role="form">\
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
				        <button id="submitButton" class="btn btn-default" onclick="login()">Sign in</button>\
				      </div>\
				    </div>\
				  </div>';



function loadContent (){
	$.get('inputEvent.html', null, function (mydata, textStatus, jqXHR){
		$("#main-content").html(mydata);
	});
}




function displayLoginForm(){
	$("#main-content").html(loginHTML);

}

var login = function (){
   	var user_email = $('#inputEmail3').val();
   	var user_password = $('#inputPassword3').val();
   	auth.login('password', {
  	  email: user_email,
  	  password: user_password
  	});
}

var logout = function(){
	auth.logout();
}

