# The Smiling Locksmith: Web App

<img width="400" height="400" src="https://github.com/ThisTeam404/WebPart/blob/main/client/src/OfficialLogo.PNG" />

## Project Structure
This project is custom software made for The Smiling Locksmith®.
The project is split into 2 main components: the phone app and the web application
The phone app and web application are separated into separate repositories.

This is the link to the phone app repository: https://github.com/ThisTeam404/Mobile-App</br>
This is the link to the web application repository: https://github.com/ThisTeam404/WebPart</br>

## Description
The goal of this project is to have an app that generates key pins for door locks. This app will be used by a locksmith who currently has to manually come up with different key pins each time he works on a job.

This respository is for the website that will display the saved key pins. Each time the locksmith works on a lock he'll generate the key pins on the iphone and save it on our database. He can retrieve the key pins in the future by looking it up from the database using the website interface. There is another respository that holds the iphone codes.

## Getting Started (The Steps shown below are done on Windows 10)

### Dependencies
* Windows 10 or MacOs Moteray (The steps below are done on Windows 10) 
```
    "body-parser": "^1.19.1",
    "cls-hooked": "^4.2.2",
    "dotenv": "^16.0.0",
    "express": "^4.17.2",
    "express-mysql-session": "^2.1.7",
    "express-session": "^1.17.2",
    "express-session-sequelize": "^2.3.0",
    "jest": "^27.5.1",
    "memorystore": "^1.6.6",
    "mysql2": "^2.3.3",
    "passport": "^0.5.2",
    "passport-google-oauth20": "^2.0.0",
    "sequelize": "^6.15.0"
```

### Installing (Installing Steps only describe installation for Windows 10)

#### Where to download the web application code:
* Go to Github and clone the repository at ThisTeam404/WebPart: Web based part for mobile app to interact with (github.com) to get the Web Application code that will eventually be loaded onto the heroku server created earlier.

#### Downloading and Installing Dependicies
* Using the command console on your machine go to the folder where you cloned and the WebPart repository.

* Then change the directory to the folder called ‘server’ and run the command ‘npm install’ (you will need to install npm on your machine if you do not have it). This will install all the code dependencies for the backend code in the server folder.

* Next go to the parent folder of the ‘server’ folder, and then change the directory to the ‘client’ folder. Again using the command console, use the command ‘npm install’ to install all the code dependencies for the front end code in the ‘client’ folder.

#### Setting up the .env file
* In the Web Application code, you need to add two files with the name ‘.env’ into the ‘server’ folder and the ‘client’ folder. This file will contain all of the outside required information to run the Web Application with the Online Database and Google Signin. (For help with setting up the online database or finding the google auth information, please check out the maintenance manual)

##### .env file example
```
REACT_APP_WEB_MODE_ENABLED="false"
REACT_APP_WEBSITE_URL="https://example.com"


TEST_MODE_ENABLED="true"
WEB_MODE_ENABLED="false"
WEBSITE_URL="https://.com"

DATABASE_HOST="example.com"
DATABASE_PORT="25060"
DATABASE_TYPE="defaultdb"
DATABASE_USER="doadmin"
DATABASE_PASSWORD="examplePass"
DATABASE_DIALECT="mysql"

GOOGLE_AUTH_CLIENT_ID="1234"
GOOGLE_AUTH_SECRET="1234"
GOOGLE_AUTH_CALLBACK_URL="https://example.com"

GOOGLE_AUTH_VALID_Email_ID="RandomID_asdasdad123"
```

### Executing program locally (This still requires you to have your database setup first before runnning)

* Go into the 'server' folder
* Open command prompt and run the command:
```
node index.js
```

## Help
Any errors or issues will be displayed in the command prompt window.
More indepth details for getting the web application setup online is available in the maintenance manual


## Devlopers
Anthony Herrera</br>
Milford Gover</br>
Matthew Murata</br>
Kaily Estepa</br>
Sia Xiong</br>
Justin Moua</br>
Saba Taghibeik</br>


