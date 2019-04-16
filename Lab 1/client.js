/* Constant declarations */
var MIN_PASSWORD_LENGTH = 4;

/* Things that should only happens once per window load. Hint: Single Page Application. */
var init = function(){
    //initStorage();
}

var displayView = function(){
    var pageElement = document.getElementById('page_container');
    var token = localStorage.getItem("token");
    var response;
    var defaultTab;
    var defaultNav;


    // clear userdata in sessionStorage if it exists? Think thoroughly about when and how often we should be requesting userdata from the server, and when we should discord the local data.

    if( token !== null ) {
        /* Retrieve user data from server */
        response = serverstub.getUserDataByToken(token);
        /* response is an Object with fields "success" and "message". If "success" field has boolean value true, a third field "data" is included in the object.
        The "data" field holds an object with fields that correspond to the sign up process - password excluded. */
        if( response.success === true ) {
            // Consider the implications of storing the user data locally during the session. How often do we have to access it? Updating user data on the server? The benefits?
            // sessionStorage.setItem("userData", JSON.stringify(response.data));

            /* Get the profile page and initialize it */
            pageElement.innerHTML = document.getElementById('profileview').innerHTML;

            populateListPersonalInformation(document.getElementById("ul_personal_information"), response.data);
            refreshHomeWall();

            defaultTab = document.getElementById('home_container');
            defaultNav = document.getElementById('caramel_home');
            defaultTab.style.display = "block";
            defaultNav.style.borderBottomColor = "#ffffdd";
        }

    } else {
        /* No login token was found. Get the welcome page. */
        pageElement.innerHTML = document.getElementById('welcomeview').innerHTML;
    }

    // the code required to display a view
    attachHandlers();
};

window.onload = function(){ // TODO only happens once?
    init();
    displayView();
    window.alert("Hello TDDD97!");
    //code that is executed as the page is loaded.
    //You shall put your own custom code here.
    //window.alert() is not allowed to be used in your implementation.
}



var attachHandlers = function() {
    /* Welcome view variables */
    var signin = document.getElementById('login_container');
    var signinForm;

    var signup = document.getElementById('signup_container');
    var signupForm;
    var signupPasswordInput;
    var signupRepeatPasswordInput;

    /* Profile/Session view variables */ //Profile -> Session? [cascading]
    var navigation = document.getElementById('caramel_navigation');
    var navigationHome;
    var navigationAccount;
    var navigationBrowse;
    var tabHome;
    var tabBrowse;
    var tabAccount;
    var browseSearchBar;
    var tabSelector;

    var account = document.getElementById('account_container');
    var updatePasswordForm;
    var updatePasswordPasswordInput;
    var updatePasswordRepeatPasswordInput;

    var home = document.getElementById('home_container');
    var postButton;
    var refreshButton;

    var browse = document.getElementById('browse_container');
    var searchForm;

    /* Handlers for welcome view - Signin form */
    if( signin != null ) {
        signinForm = document.getElementById('form_signin');

        signinForm.setAttribute("onsubmit", "return false");
        signinForm.addEventListener("submit", signinSubmit);
        signinForm.addEventListener("click", function() { document.getElementById("signin_server_status").innerHTML = ""; });
    }

    /* Handlers for welcome view - Signup form */
    if( signup != null ) {
        signupForm = document.getElementById('form_signup');
        signupPasswordInput = document.getElementById('input_signup_password');
        signupRepeatPasswordInput = document.getElementById('input_signup_repeat_password');

        signupForm.setAttribute("onsubmit", "return false");
        signupForm.addEventListener("submit", signupSubmit);
        signupForm.addEventListener("click", function() { document.getElementById("signup_server_status").innerHTML = ""; });

        signupPasswordInput.addEventListener("input", signupInspector);
        signupRepeatPasswordInput.addEventListener("input", signupInspector);
    }

    /* Handlers for profile view - Navigation bar */
    if( navigation != null ) {
        navigationHome = document.getElementById('caramel_home');
        navigationAccount = document.getElementById('caramel_account');
        navigationBrowse = document.getElementById('caramel_browse');
        tabHome = document.getElementById('home_container');
        tabAccount = document.getElementById('account_container');
        tabBrowse = document.getElementById('browse_container');
        browseSearchBar = document.getElementById('caramel_search_bar');
        tabSelector = function(event) { // make global and also use in displayView?
            tabHome.style.display = "none";
            tabBrowse.style.display = "none";
            tabAccount.style.display = "none";
            browseSearchBar.style.display = "none";

            navigationHome.style.borderBottomColor = "#b0883a";
            navigationBrowse.style.borderBottomColor = "#b0883a";
            navigationAccount.style.borderBottomColor = "#b0883a";

            /* Underline active tab */
            event.currentTarget.style.borderBottomColor = "#ffffdd";
            /* Display tab content */
            event.currentTarget.content.style.display = "block";

            if( event.currentTarget === navigationBrowse ) {
                browseSearchBar.style.display = "block";
            }
        };

        // make a changeBackgroundColor = function (element , color){} - element = -this-?
        navigationHome.addEventListener("mouseover", function() {navigationHome.style.backgroundColor = "#967533" });
        navigationBrowse.addEventListener("mouseover", function() {navigationBrowse.style.backgroundColor = "#967533" });
        navigationAccount.addEventListener("mouseover", function() {navigationAccount.style.backgroundColor = "#967533" });

        navigationHome.addEventListener("mouseout", function() {navigationHome.style.backgroundColor = "#b0883a" });
        navigationBrowse.addEventListener("mouseout", function() {navigationBrowse.style.backgroundColor = "#b0883a" });
        navigationAccount.addEventListener("mouseout", function() {navigationAccount.style.backgroundColor = "#b0883a" });

        navigationHome.content = tabHome;
        navigationHome.addEventListener("click", tabSelector);
        navigationBrowse.content = tabBrowse;
        navigationBrowse.addEventListener("click",  tabSelector);
        navigationAccount.content = tabAccount;
        navigationAccount.addEventListener("click", tabSelector);

        // document.getElementById("caramel_search_submit") <-- use for submit handler

    }

    /* Handlers for profile view - Account container */
    if( account != null ){
        updatePasswordForm = document.getElementById('form_updatepw');
        updatePasswordPasswordInput = document.getElementById('input_updatepw_new_password');
        updatePasswordRepeatPasswordInput = document.getElementById('input_updatepw_repeat_new_password');
        signoutButton = document.getElementById('signout_button');

        updatePasswordForm.setAttribute("onsubmit", "return false");
        updatePasswordForm.addEventListener("submit", updatePasswordSubmit);
        updatePasswordForm.addEventListener("click", function() { document.getElementById("updatepw_status").innerHTML = ""; });

        updatePasswordPasswordInput.addEventListener("input", updatePasswordInspector);
        updatePasswordRepeatPasswordInput.addEventListener("input", updatePasswordInspector);

        signoutButton.addEventListener("click", signoutRequest);
    }

    /* Handlers for profile view - Home container */
    if( home != null ){
        postButton = document.getElementById('post_button');
        refreshButton = document.getElementById('refresh_button');

        postButton.addEventListener("click", postRequest);
        refreshButton.addEventListener("click", refreshHomeWall);


    }

    /* Handlers for profile view - Browse container */
    if( browse != null ){
        searchForm = document.getElementById("caramel_search_bar");

        searchForm.setAttribute("onsubmit", "return false");
        searchForm.addEventListener("submit", searchSubmit);
    }


}

var signupInspector = function() {
    var passwordElmt = document.getElementById("input_signup_password");
    var rPasswordElmt = document.getElementById("input_signup_repeat_password");
    var signupFormStatusElmt = document.getElementById("signup_form_status");
    var submitButton = document.getElementById("signup_form_submit");

    var response = validatePassword(passwordElmt, rPasswordElmt);

    if( response.passwordValid === true ) {
        signupFormStatusElmt.style.color = "green";
        submitButton.removeAttribute("disabled");
    } else {
        signupFormStatusElmt.style.color = "red";
        submitButton.setAttribute("disabled", "");
    }
    signupFormStatusElmt.innerHTML = response.message; //signupFormStatus?
}

// Change name?
var signupSubmit = function() {
    // TODO: change to values from input fields
    var signupServerStatusElmt = document.getElementById("signup_server_status");
    var formData = {email: document.getElementById("input_signup_email").value,
                    password: document.getElementById("input_signup_password").value,
                    firstname: document.getElementById("input_signup_firstname").value,
                    familyname: document.getElementById("input_signup_familyname").value,
                    gender: document.getElementById("select_signup_gender").value,
                    city: document.getElementById("input_signup_city").value,
                    country: document.getElementById("input_signup_country").value};

    var response = serverstub.signUp(formData);
    /* response is an Object with fields "success" and "message". */

    // If response.success === true, log in (serverstub.signIn(username,password)), if false, error message in another div element
    if( response.success === true ) {
        // logIn and or serverstub.signIn
    } else {
        signupServerStatusElmt.innerHTML = response.message;
    }
}

// Change name?
var signinSubmit = function() {
    var signinServerStatusElmt = document.getElementById("signin_server_status");
    var email = document.getElementById("input_signin_email").value;
    var password = document.getElementById("input_signin_password").value;

    var response = serverstub.signIn(email, password);
    /* response is an Object with fields "success" and "message". If "success" field has boolean value true, a third field "data" is included in the object. */

    if( response.success === true ) {
        localStorage.setItem("token", response.data);
        displayView();
    } else {
        signinServerStatusElmt.innerHTML = response.message;
    }

}

var updatePasswordInspector = function() {
    var passwordElmt = document.getElementById("input_updatepw_new_password");
    var rPasswordElmt = document.getElementById("input_updatepw_repeat_new_password");
    var formStatusElmt = document.getElementById("updatepw_status");
    var submitButton = document.getElementById("form_updatepw_submit");

    var response = validatePassword(passwordElmt, rPasswordElmt);

    if( response.passwordValid === true ) {
        formStatusElmt.style.color = "green";
        submitButton.removeAttribute("disabled");
    } else {
        formStatusElmt.style.color = "red";
        submitButton.setAttribute("disabled", "");
    }
    formStatusElmt.innerHTML = response.message;
}

var updatePasswordSubmit = function() {
    var token = localStorage.getItem("token");
    var form = document.getElementById("form_updatepw");
    var oldPassword = document.getElementById("input_updatepw_old_password").value;
    var newPassword = document.getElementById("input_updatepw_new_password").value;
    var serverStatusElmt = document.getElementById("updatepw_server_status");

    var response = serverstub.changePassword(token, oldPassword, newPassword);
    /* response is an Object with fields "success" and "message". */

    form.reset();
    serverStatusElmt.innerHTML = response.message;
}

var signoutRequest = function() {
    var token = localStorage.getItem("token");

    var response = serverstub.signOut(token);
    /* response is an Object with fields "success" and "message". */

    if( response !== undefined ) {
        localStorage.removeItem("token");
        displayView();
    } else {
        // TODO? uh oh
        window.alert("dropped my spaghetti");
    }
}

var postRequest = function() { //consider making generic and adding attributes to the button elements => event.currentTarget.attachedTextSource
    var token = localStorage.getItem("token");
    var textArea = document.getElementById("wall_textarea"); // Not sanitized content

    var response = serverstub.getUserDataByToken(token);
    /* response is an Object with fields "success" and "message". If "success" field has boolean value true, a third field "data" is included in the object.
    The "data" field holds an object with fields that correspond to the sign up process - password excluded. */

    if( response.success === true ){
        serverstub.postMessage(token, textArea.value, response.data.email);
        textArea.value = "";
        refreshHomeWall();// refreshWall or whatever
    } else {
        window.alert("I'm a little server, small - not tough. I couldn't process, any of your stuff.");
    }


}

var refreshHomeWall = function() { // Generalize? Home and Browse pages and functions are very similar
    var token = localStorage.getItem("token");
    var wall = document.getElementById("wall_messages_container");

    var response = serverstub.getUserMessagesByToken(token);
    /* response is an Object with fields "success" and "message". If "success" field has boolean value true, a third field "data" is included in the object.
    The "data" field holds an array with objects with fields "writer" and "content". */

    if( response.success === true ){
        /* Tear down that wall */
        while( wall.firstChild ){
            wall.firstChild.remove();
        }
        /* Rebuild it */
        response.data.forEach(function(messageObject) {
            var messageContainer = document.createElement("div");
            var textNode = document.createTextNode(messageObject.writer + " " + messageObject.content);
            messageContainer.appendChild(textNode);
            wall.appendChild(messageContainer);
        });
    } else {
        window.alert("I'm a little server, small - not tough. I couldn't process, any of your stuff.");
    }
}

var searchSubmit = function() {
    var myToken = localStorage.getItem("token");
    var email = document.getElementById("caramel_search_input").value;
    var hiddenBrowseContent = document.getElementById("browse_content_container");
    var profileDataList = document.getElementById("ul_browse_personal_information");

    var responseData = serverstub.getUserDataByEmail(myToken, email);
    var responseMessages = serverstub.getUserMessagesByEmail(myToken, email);

    if( responseData.success === true && responseMessages.success === true ){
        hiddenBrowseContent.style.display = "block"; // Currently only relevant once

        populateListPersonalInformation(profileDataList, responseData.data);
        //refreshWall();
    }
}

var populateListPersonalInformation = function(personalInformationList, userData) {
    //var personalInformationList = document.getElementById("ul_personal_information");
    var listItem;
    var textNode;

    /* Kill old list nodes */
    while( personalInformationList.firstChild ){
        personalInformationList.firstChild.remove();
    }

    //generalize for horizontally flat objects
    listItem = document.createElement("LI")
    textNode = document.createTextNode(userData.email);
    listItem.appendChild(textNode);
    personalInformationList.appendChild(listItem);

    listItem = document.createElement("LI")
    textNode = document.createTextNode(userData.firstname + " " + userData.familyname);
    listItem.appendChild(textNode);
    personalInformationList.appendChild(listItem);

    listItem = document.createElement("LI")
    textNode = document.createTextNode(userData.gender);
    listItem.appendChild(textNode);
    personalInformationList.appendChild(listItem);

    listItem = document.createElement("LI")
    textNode = document.createTextNode(userData.city);
    listItem.appendChild(textNode);
    personalInformationList.appendChild(listItem);

    listItem = document.createElement("LI")
    textNode = document.createTextNode(userData.country);
    listItem.appendChild(textNode);
    personalInformationList.appendChild(listItem);
}


// Think about use cases.
var validatePassword = function(passwordElmt, rPasswordElmt) {
    var password = passwordElmt.value;
    var rPassword = rPasswordElmt.value;
    var response = {passwordValid: false, message: "ERROR: Something went wrong"};

    if( password === "" || rPassword === "" ) {
        response = {passwordValid: false, message: ""};
    } else if( password !== rPassword ) {
        response = {passwordValid: false, message: "Passwords do not match"};
    } else if( password.length < MIN_PASSWORD_LENGTH ) {
        response = {passwordValid: false, message: "Password is too short"};
    } else {
        response = {passwordValid: true, message: "Password is valid"};
    }

    return response;
}
