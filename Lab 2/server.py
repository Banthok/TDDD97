from flask import Flask
app = Flask(__name__)


#[!]# Not urgent, but at some point: Find out whether we should be using JSON from the client rather than the form submit.
@app.route('/signin')
def sign_in():
    error = None
    if is_valid_signin(request.form['email'],
                       request.form['password']):
        return sign_in_user(request.form['email'])
    else:
        error = "Wrong username or password."
    return error_temp_function(error)


def sign_in_user(email):
    # Generate token
    letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    token = ""
    # 36 random characters from letters
    # Add user to the logged in table (in database)
    return jsonify({'success': True, 'message': "Successfully signed in.", 'data': token})


signIn: function(email, password){
syncStorage();


if(users[email] != null && users[email].password == password){
var letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
var token = "";
for (var i = 0 ; i < 36 ; ++i) {
  token += letters[Math.floor(Math.random() * letters.length)];
}
loggedInUsers[token] = email;
persistLoggedInUsers();
return {"success": true, "message": "Successfully signed in.", "data": token};
} else {
return {"success": false, "message": "Wrong username or password."};
}
}

def sign_up

def sign_out

def change_password

def get_user_data_by_token

def get_user_data_by_email

def get_used_messages_by_token

def get_user_messages_by_email

def post_message
