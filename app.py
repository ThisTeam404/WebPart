from flask import Flask, render_template, request, jsonify, redirect, url_for

import json

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('test.html')
    # return render_template('home.html', selection=request.form['rad'])

@app.route('/login', methods=['GET', 'POST'])
def login():
    correctLogin = ("user", "password")
    username=''
    password=''

    if request.method == "POST":
        username = request.form.get('uname')
        password = request.form.get('psw')
        #print(username)
        #print(password)
    if correctLogin[0] != username or correctLogin[1] != password:
        return render_template('incorrectLogin.html')

    return render_template('correctLogin.html')

if __name__ == '__main__':
    app.run(debug=True)