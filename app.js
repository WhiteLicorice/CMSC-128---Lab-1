//  Boilerplate login-logout system developed using Node.js + Express framework for CMSC 128 Lab 1 by RA Jocsing

const express = require("express");
const app = express();
const session = require("express-session");

const PORT = 6969;  
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(session({
    secret: "Don't put secret key here in production environments",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 86400000},
})); // Cookie life is one day in ms if user exits the page. If inactive for 5 min and on page, destroy-timer.js is invoked.

//  In-memory hashmap that represents a user:password database for demonstration purposes. 
let userbase = {"Demo": "example123"};

//  Abstraction of user session for demonstration purposes. Implemented with express-session.
// let dummyUser = null; 

//  Abstraction for error messages. Insert your preferred advanced error-handling module here. 
let errMessage = null;

//  Upon accessing the home page, check if a user is logged in. If not, redirect to log in page. Otherwise, display home page with name.
app.get("/", (req, res) => {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        res.render("home", {user: req.session.user});
    }
});

//  Upon accessing the register page, check if a user is logged in. If not, proceed to register. Otherwise, redirect to home page.
app.get("/register", (req, res) => {
    if (req.session.user) {
        res.redirect("/");
    }
    else {
        res.render("register", {message: errMessage});
        errMessage = null;
    }
});

//  Upon accessing the login page, check if a user is logged in. If not, proceed. Otherwise, redirect to home page. 
app.get("/login", (req, res) => {
    if (req.session.user) {
        res.redirect("/");
    }
    else {
        res.render("login", {message: errMessage});
        errMessage = null;
    }
});

//  Upon accessing logout page, prompt user that they have been logged out successfully and destroy session on backend. 
app.get("/logout", (req, res) => {
    req.session.destroy();
    errMessage = "You have been successfully logged out.";
    res.render("logout", {message: errMessage});
    errMessage = null;
})

//  An alternate route to logout page, where the user timed out due to inactivity. Destroy session and inform user on frontend. 
app.get("/timeout", (req, res) => {
    req.session.destroy();
    errMessage = "You have been logged out due to inactivity.";
    res.render("logout", {message: errMessage});
    errMessage = null;
})

//  Upon posting to login route, check if the username exists. If not, prompt user. Otherwise, verify password. If match is found,
//  proceeed to the home page. Otherwise, prompt user that the password is incorrect.
app.post("/login", (req, res) => {
    var attemptUser = userbase[req.body.userName];
    if (!attemptUser){ 
        errMessage = "No such user exists.";
        res.redirect("/login");
    } else if (req.body.password != attemptUser) {
        errMessage = "Wrong password.";
        res.redirect("/login");
    } else {
        req.session.user = req.body.userName;
        res.redirect("/");
    }
})

//  Upon posting to register route, check if the username already exists. If true, prompt user. Otherwise, validate password
//  via helper function. If helper function returns an error, prompt the user. Otherwise, proceed to login page. 
app.post("/register", (req, res) => {
    var attemptUser = userbase[req.body.userName];
    if (attemptUser) {
        errMessage = "Username is already taken.";
        res.redirect("/register");
    } else {
        errMessage = validatePasssword(req.body.password);
        if (!errMessage) {
            console.log(req.body.userName + ": " + req.body.password)
            userbase[req.body.userName] = [req.body.password];
            res.redirect("/login");
        } else {
            res.redirect("/register");
        }
    }
})

//  Upon posting to logout route, simply redirect to logout page. 
app.post("/logout", (req, res) => {
    res.redirect("/logout");
})

//  Simple password validator. Checks if the password meets the following conditions below, returning an error if not.
//  A null object is returned if the password is valid. Runs in cascade, returning errors found from top to bottom. 
function validatePasssword(password) {
    if (password.length < 8) {
        return "Password must contain at least 8 characters.";
    }
    else if (password.search(/\d/) == -1) {
        return "Password must contain at least 1 number.";
    }
    else if (password.search(/[A-Z]/) == -1) {
        return "Password must contain at least 1 capital letter.";
    }
    else if (password.search(/[!@#$%^&*]/) == -1) {
        return "Password must contain at least 1 symbol.";
    } 
    else {
        return null;
    }
}

// Runs the app on localhost:PORT/ where PORT is defined above. 
app.listen(PORT, () => {
    console.log("SERVER STARTED => PORT: " + PORT);
});