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
		    loadContent();
		    return;
		  } else {
		  	console.log("attempting to login");

		  	var usr = auth.login('password', {
		  	  email: $('#inputEmail3').val(),
		  	  password: $('#inputPassword3').val()
		  	});

		  	if(!usr._id){
		  		alert("Incorrect email address or password.");
		  		console.log("couldn't log in")
		  	}
		  	else{
		  		console.log("login successful!")
		  		loadContent();
		  	}
		    return;
		  }
		}

		function loadContent (){
			console.log("loading content...");

			//$( "#main-content" ).html( "HELLO!" );
		}
	
}

