//	Grab the elements from the home page so we can manipulate them using JS.
var passwordField = document.querySelector("#password");
var loginButton = document.querySelector("#login");
var registerButton = document.querySelector("#register");
var header = document.querySelector("#header");
var show = document.querySelector("#show");

//	A switch function that listens for a click on the X button. 
//	If pressed, change the type attribute of the password field into either "text" if "password" initially 
//	or "password" if "text" initially. Allows the user to toggle password visibility on and off without relying on browser features. 
show.addEventListener("click", function (e) {
	var state = passwordField.getAttribute("type");
	if (state == "password") {
		passwordField.setAttribute("type", "text")
	}
	else {
		passwordField.setAttribute("type", "password")
	}
});