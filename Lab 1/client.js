/* Constant declarations */
var MIN_PASSWORD_LENGTH = 4;

/* Things that should only happens once per window load. Hint: Single Page Application. */
var init = function(){
    //initStorage();
}

var displayView = function(){
    var pageElement = document.getElementById("page_container");
    var token = localStorage.getItem("token");
    var response;
    var defaultTab;
    var defaultNav;

    if( token !== null ) {
        /* Retrieve user data from server */
        response = serverstub.getUserDataByToken(token);
        /* response is an Object with fields "success" and "message". If "success" field has boolean value true, a third field "data" is included in the object.
        The "data" field holds an object with fields that correspond to the sign up process - password excluded. */
        if( response.success === true ) {
            /* Get the profile page and initialize it */
            pageElement.innerHTML = document.getElementById('profileview').innerHTML;

            populateListPersonalInformation(document.getElementById("ul_personal_information"), response.data);
            refreshWall(document.getElementById("wall_home_messages_container"));

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
    var caramelBar;
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
    var homePostButton;
    var homeRefreshButton;

    var browse = document.getElementById('browse_container');
    var searchForm;
    var browsePostButton;
    var browseRefreshButton;

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
        caramelBar = document.getElementById('caramel_bar');
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

        // change this to css styling using the hover selector
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

        caramelBar.addEventListener("click", function() {
            var caramelErrorBox = document.getElementById("caramel_error");
            caramelErrorBox.style.transition = "opacity 1s";
            caramelErrorBox.style.opacity = "0";
        });
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
        homePostButton = document.getElementById('home_post_button');
        homeRefreshButton = document.getElementById('home_refresh_button');

        homePostButton.addEventListener("click", postRequestListener);
        homeRefreshButton.addEventListener("click", refreshWallDispatcher);
    }

    /* Handlers for profile view - Browse container */
    if( browse != null ){
        searchForm = document.getElementById("caramel_search_bar");
        browsePostButton = document.getElementById("browse_post_button");
        browseRefreshButton = document.getElementById("browse_refresh_button");

        searchForm.setAttribute("onsubmit", "return false");
        searchForm.addEventListener("submit", searchSubmit);

        browsePostButton.addEventListener("click", postRequestListener);
        browseRefreshButton.addEventListener("click", refreshWallDispatcher);
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

var postRequestListener = function(event) {
    var token = localStorage.getItem("token");
    var textArea; // Not sanitized content
    var wall;
    var recipientEmail;
    var response;

    /* Acquire arguments */
    if( event.currentTarget === document.getElementById("home_post_button") ){
        textArea = document.getElementById("wall_home_textarea");
        wall = document.getElementById("wall_home_messages_container");
        recipientEmail = serverstub.getUserDataByToken(token).data.email; // Potentially superfluous. Current postMessage implementation checks if email == null, and assumes it is a self post if that is the case. Documentation does not suggest the implementation has to work that way though.
    } else { /* Posting on browse tab */
        textArea = document.getElementById("wall_browse_textarea");
        wall = document.getElementById("wall_browse_messages_container");
        recipientEmail = JSON.parse(sessionStorage.getItem("lastSearch")).email;
    }

    response = serverstub.postMessage(token, textArea.value, recipientEmail);

    if( response.success === true ){
        textArea.value = "";
        refreshWall(wall);
    } else {
        window.alert("I'm a little server, small - not tough. I couldn't process, any of your stuff.");
    }
}

// TODO: This just doesn't feel great.
var refreshWallDispatcher = function(event) {
    if( event.currentTarget === document.getElementById("home_refresh_button") ){
        refreshWall(document.getElementById("wall_home_messages_container"));
    } else {
        refreshWall(document.getElementById("wall_browse_messages_container"));
    }
}

var refreshWall = function(wall) {
    var token = localStorage.getItem("token");
    var response;
    var email;

    if( wall === document.getElementById("wall_home_messages_container") ){
        response = serverstub.getUserMessagesByToken(token);
    } else {
        email = JSON.parse(sessionStorage.getItem("lastSearch")).email;
        response = serverstub.getUserMessagesByEmail(token, email);
    }
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
        /* There were no messages */
        if( wall.firstChild === null ){
            wall.appendChild(generatePlaceholderMessage());
        }
    } else {
        window.alert("I'm a little server, small - not tough. I couldn't process, any of your stuff.");
    }
}

var searchSubmit = function() {
    var token = localStorage.getItem("token");
    var email = document.getElementById("caramel_search_input").value;
    var hiddenBrowseContent = document.getElementById("browse_content_container");
    var profileDataList = document.getElementById("ul_browse_personal_information");
    var messageWall = document.getElementById("wall_browse_messages_container");
    var caramelErrorBox = document.getElementById("caramel_error");

    var responseData = serverstub.getUserDataByEmail(token, email);
    var responseMessages = serverstub.getUserMessagesByEmail(token, email);

    if( responseData.success === true && responseMessages.success === true ){
        hiddenBrowseContent.style.display = "block"; // Currently only relevant once

        /* Store found user's data locally. To be used for context in functions involving the browse tab content. */
        sessionStorage.setItem("lastSearch", JSON.stringify(responseData.data));

        populateListPersonalInformation(profileDataList, responseData.data);
        refreshWall(messageWall);
        // Clear search input ?
    } else if( responseData.success === false ) {
        caramelErrorBox.textContent = responseData.message;
        caramelErrorBox.style.transition = "";
        caramelErrorBox.style.opacity = "1";
    } else if( responseMessages.success === false ) {
        caramelErrorBox.textContent = responseMessages.message;
        caramelErrorBox.style.transition = "";
        caramelErrorBox.style.opacity = "1";
    }
}

var populateListPersonalInformation = function(personalInformationList, userData) {
    var listItem;
    var textNode;

    /* Kill old list nodes */
    while( personalInformationList.firstChild ){
        personalInformationList.firstChild.remove();
    }

    //generalize for horizontally flat objects?
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

var generatePlaceholderMessage = function(){
    var messageContainer = document.createElement("div");
    messageContainer.classList.add("wall_messages_placeholder");
    var placeholderText = document.createTextNode("There seems to be nothing here");
    messageContainer.appendChild(placeholderText);

    return messageContainer;
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
