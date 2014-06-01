function login(){
	$.getScript('https://cdn.firebase.com/js/simple-login/1.4.1/firebase-simple-login.js', function(){
		var fb = new Firebase('https://amber-fire-6558.firebaseio.com');
		var auth = new FirebaseSimpleLogin(fb, function(error, user) {
		  if (error) {
		    // an error occurred while attempting login
		    console.log(error);
		    alert("Incorrect email address or password");
		    return ;
		  } else if (user) {
		    $( "#main-content" ).load( "admin-content.html" );
		    return;
		  } else {
		  	return null;
		  	//not logged in
		  }
		});
	});
}

