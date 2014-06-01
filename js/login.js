function login(){
		var fb = new Firebase('https://amber-fire-6558.firebaseio.com');
		var auth = new FirebaseSimpleLogin(fb, check);

		function check (error, user) {

		  if (error) {
		    // an error occurred while attempting login
		    console.log(error);
		    alert("An error occurred while trying to sign in.");
		    return ;
		  } else if (user) {
		    console.log(user);
		    $( "#main-content" ).load( "inputEvent.html" );
		    return;
		  } else {
		  	
		  	var usr = auth.login('password', {
		  	  email: $('#inputEmail3').val(),
		  	  password: $('#inputPassword3').val()
		  	});
		  	

		  	console.log("User: ", !!usr._id);
		  	if(!usr)
		  		alert("Incorrect email address or password.");
		    return;
		  }
		}
	
}

