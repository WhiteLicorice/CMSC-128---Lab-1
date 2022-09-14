let maxTime = 300000;
let timeoutURL = "/timeout";
var startTime = null;

// Continuous polling? Polling starts when user leaves page, because starting to poll when user stops clicking is inconvenient for them. 
window.onblur = function() {
    //Start timer here
    console.log("inactive");
    startTime = +new Date();

    //Every five seconds, check if the user's inactivity exceeds the five-minute mark. If true, go to log out page and destroy session.
    let pollingInterval = setInterval (function (){
        console.log("+5 seconds of inactivity has passed");
        if (+new Date() - startTime > maxTime) {
            window.location.href = "/timeout";
        }
    }, 5000); //Time is in milliseconds and 1000 milliseconds = 1 second. 

    // User has to click page to signify activity once marked inactive. 
    window.onclick = function() {
        //Reset timer here
        clearInterval(pollingInterval);
        console.log("active");
        startTime = null;
    }
};



