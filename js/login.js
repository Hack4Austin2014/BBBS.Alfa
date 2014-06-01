function login(){
		var fb = new Firebase('https://amber-fire-6558.firebaseio.com');
		var auth = new FirebaseSimpleLogin(fb, function(error, user) {
		  alert("got thsi far");

		  if (error) {
		    // an error occurred while attempting login
		    console.log(error);
		    alert("Incorrect email address or password");
		    return ;
		  } else if (user) {
		    $( "#main-content" ).load( "inputEvent.html" );
		    return;
		  } else {
		  	
		  	var usr = auth.login('password', {
		  	  email: $('#inputEmail3').val(),
		  	  password: $('#inputPassword3').val()
		  	});

		  	if(!usr)
		  		alert("Incorrect email address or password.");
		    return;
		  }
		});
	
}

