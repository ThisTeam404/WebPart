const express       = require('express')
const app           = express()
const path          = require('path')
const bodyParser    = require('body-parser')
const session       = require('express-session')
const passport      = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const fs = require('fs')

require('dotenv').config()
//console.log(process.env)

const { getData, createNewTuple, updateTuple, deleteData } = require('../Database/db.js');

const crypto = require('crypto')

const PORT = process.env.PORT || 3000;
const SITE_URL = process.env.WEB_MODE_ENABLED == "false" ? "http://localhost:" + PORT : process.env.WEBSITE_URL
const GOOGLE_AUTH_CLIENT_ID = process.env.GOOGLE_AUTH_CLIENT_ID
const GOOGLE_AUTH_SECRET = process.env.GOOGLE_AUTH_SECRET
const GOOGLE_AUTH_CALLBACK_URL = process.env.WEB_MODE_ENABLED == "false" ? SITE_URL + "/auth/success" : process.env.GOOGLE_AUTH_CALLBACK_URL
const GOOGLE_AUTH_VALID_Email_ID = process.env.GOOGLE_AUTH_VALID_Email_ID   // The Google Account email that the server will allow to log in
const TEST_MODE_ENABLED = process.env.TEST_MODE_ENABLED

//console.log(SITE_URL, GOOGLE_AUTH_CALLBACK_URL)

if (TEST_MODE_ENABLED){
    console.error("Test Mode is enabled, turn test mode off when in production")
    console.error("Test Mode is enabled, turn test mode off when in production")
    console.error("Test Mode is enabled, turn test mode off when in production")
    console.error("Test Mode is enabled, turn test mode off when in production")
    console.error("Test Mode is enabled, turn test mode off when in production")
    console.error("Test Mode is enabled, turn test mode off when in production")
    console.error("Test Mode is enabled, turn test mode off when in production")
}


// const MemoryStore = require('memorystore')(session);

//Notes:
/*
1. remind Justin about __dirname cause it's no longer the direct child
directory of the root folder server.



*/

const MySqlStore = require('express-session-sequelize')(session.Store)


const SessionTable = require('../Database/Tables/session-table.js');
const JobTable = require('../Database/Tables/job-table.js');
const sequelize = require('../Database/Tables/connection-instance.js')
//const { resolveSoa } = require('dns')

const sequelizeSessionStore = new MySqlStore({db: sequelize})

const API_KEY_LENGTH = 10;
const API_KEY_TIME_TO_LIVE = 1000 * 60 * 2 // ms in a second * number = how many seconds to live

// KeyInfo object builder
function KeyInfo(timeToLiveInMillisecond, keyValue){
    this.timeToLiveInMS = timeToLiveInMillisecond
    this.keyValue = keyValue
    this.timeOfCreation = new Date() 
}

function isAPIKeyExpired(apiKeyInfo){
    currentTime = new Date()
    if((currentTime - apiKeyInfo.timeOfCreation) > apiKeyInfo.timeToLiveInMS){
        return true
    }
    return false
}

function isAPIKeyStringCorrect(incomingAPIKeyString, currentAPIKeyString){
    if (TEST_MODE_ENABLED){
        return true
    }

    if(incomingAPIKeyString == currentAPIKeyString){
        return true
    }
    return false
}

const generateAPIKey = () => {
    // generate short password for api key
    // display api key on screen if logged in
    // invalidate api key after a set amount of time
    let arrayOfRandomNum = new Uint32Array(API_KEY_LENGTH)
    crypto.webcrypto.getRandomValues(arrayOfRandomNum)
    
    let result           = "";
    let characters       = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@#$%&?";
    let charactersLength = characters.length;

    arrayOfRandomNum.forEach((value, index, arr)=>{
        result += characters.charAt(value % charactersLength)
    })
    app.locals.activeApiKey = new KeyInfo(API_KEY_TIME_TO_LIVE, result)

   return result;
}
generateAPIKey()


const runServer = () => {
app.use(express.static(path.join(__dirname, '../build')))
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())

app.use(session({
    secret: "Super Secret Keyboard",
    store: sequelizeSessionStore,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new GoogleStrategy({
    clientID: GOOGLE_AUTH_CLIENT_ID,
    clientSecret: GOOGLE_AUTH_SECRET,
    callbackURL: GOOGLE_AUTH_CALLBACK_URL,
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    passReqToCallback: true
  },
  function verify(req, accessToken, refreshToken, profile, cb)
  {
    //console.log('Logged in for %j}', profile.emails)
    if (profile.emails != GOOGLE_AUTH_VALID_Email_ID && !TEST_MODE_ENABLED){
        return cb("Attempted to login with invalid google account.", null)
    }
    else{
        //console.log("Correct Google Account Logged in \n\n")
    }
    // check if logged in with correct email, if not correct email then return to login page and display error
    cb(null, profile)
  }
));

passport.serializeUser( (user, done)=>{
    //console.log(user)
    done(null, user.id)
})

passport.deserializeUser( (id, done)=>{
    //console.log(id)
    done(null, id)
})


function isLoggedIn(req, res, next) {
    //console.log("AAA" + req.isAuthenticated())
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/");
    }
  }

app.get('/', (req, res)=>{
    //console.log(__dirname)
    //res.sendFile(__dirname + '/index.html')
    res.sendFile(path.join(__dirname, '../build/index.html'))
})

app.post('/', (req, res)=>{
    //console.log("Post Request Recieved" + ` ${req}`)
    //res.redirect('/login/google')
})

app.get('/auth/isLoggedInCheck', (req, res)=>{
    //console.log("%j", req.body)
    //console.log("%j", req.params)
    //console.log("%j", req.query)
    //console.log("%j", req.session)
    if (req.isAuthenticated()) {
        res.send({"result": "true"})
      } else {
        res.send({"result": "false"})
      }
})

app.get('/getAPIKey', isLoggedIn, (req, res)=>{
    // Implementation for if there can only be one api key

    if (typeof req.app.locals.activeApiKey == 'undefined' || isAPIKeyExpired(req.app.locals.activeApiKey)){ 
        req.app.locals.activeApiKey = new KeyInfo(API_KEY_TIME_TO_LIVE, generateAPIKey())
    }

    const string = [{
        "data": req.app.locals.activeApiKey.keyValue
    }]

    //console.log(req.app.locals.activeApiKey)
    res.send(JSON.stringify(string))
    
    /* Implementation for if there can be more than 1 api key
    const removeDeadApiKeys = (arrOfApiKeyObjects) =>{
        currentTime = new Date()
        const result = arrOfApiKeyObjects.filter((value)=>{
            console.log(currentTime - value.timeOfCreation)
            return (currentTime - value.timeOfCreation) < value.timeToLiveInMS
        })
        return result
    }

    function KeyInfo(timeToLiveInMillisecond, keyValue){
        this.timeToLiveInMS = timeToLiveInMillisecond
        this.keyValue = keyValue
        this.timeOfCreation = new Date() 
    }

    API_KEY_TIME_TO_LIVE = 1000 * 60 * 2 // ms in a second * number = how many seconds to live
    emptyArr = []
    if (typeof req.app.locals.activeApiKeys == 'undefined'){
        req.app.locals.activeApiKeys = emptyArr.concat(new KeyInfo(API_KEY_TIME_TO_LIVE, apiKey))
    }else{
        req.app.locals.activeApiKeys = removeDeadApiKeys(req.app.locals.activeApiKeys)
        req.app.locals.activeApiKeys = emptyArr.concat(req.app.locals.activeApiKeys, new KeyInfo(API_KEY_TIME_TO_LIVE, apiKey))
    }
    
    console.log(req.app.locals.activeApiKeys)
    res.send(JSON.stringify(string))
    */
})

app.get('/auth/login/google',
 passport.authenticate('google', {scope: ['profile', 'email'], failureRedirect: ['/']}))

app.get(
    '/auth/success',
    passport.authenticate('google', {scope: ['profile', 'email'], failureRedirect: ['/a']}),
    (req, res)=>{
        const string = [{
            "loginStatus":"true"
        }]
        //console.log("isAuth? ", req.isAuthenticated())
        //res.send(JSON.stringify(string))
        //res.sendFile(path.join(__dirname, '../build/index.html'))
        res.redirect('/')
    }
)

app.post('/auth/logout', (req, res)=>{
    //console.log(req.body)
    req.logOut()
    const string = {
        "data":"Successfully Logged out"
    }
    res.send(JSON.stringify(string))
})

app.get('/database', isLoggedIn, (req, res)=>{

    const startDB = async()=>{

        let sessionTB = await SessionTable.findAll();

        //console.log(`Object type: ${JSON.stringify(sessionTB)}`);
        myData = JSON.stringify(sessionTB);

        const string = [{
            "data": JSON.stringify(sessionTB)
        }]
        res.send(JSON.stringify(string))

      };

      startDB();

})

app.get('/getData', isLoggedIn, (req, res)=>{

   const getTable = async() => {
    
    let myData = await getData();

    res.send(JSON.stringify(myData));
    // myData format = [singleKeyWithJobObj, singleKeyWithJobObj]
   }

   getTable();

})


app.put('/updateTuple', isLoggedIn, (req, res)=>{
    try{
        updateTuple(req.body);
        //console.log(JSON.stringify(req.body, null, 4));
        res.send(JSON.stringify({"status":"Success"}))
    } catch{
        res.send(JSON.stringify({"status":"Success"}))
        //need to handle invalid data scenerio
        
    }
})

app.post('/createNewTuple',(req, res)=>{
    if(req.body.finalArray.apiKey == undefined){
        res.send(JSON.stringify({"status":"ERROR: finalArray obj is missing apiKey field"}))
        return
    }
    apiKey = req.body.finalArray.apiKey
    try{
        if(!(isAPIKeyStringCorrect(apiKey, req.app.locals.activeApiKey.keyValue))){
            res.send(JSON.stringify({"status":"ERROR: Invalid API key"}))
            return
        }

        createNewTuple(req.body.finalArray);
        //console.log(JSON.stringify(req.body, null, 4));
        res.send(JSON.stringify({"status":"Success"}))

    }catch(e){
        //console.error(e)
        res.send(JSON.stringify({"status":"ERROR"}))
        //need to handle invalid data scenerio
    }
})

app.delete('/deleteTuple', isLoggedIn, (req, res)=>{
    try{

        const deleteTable = async() => {
    
            let myData = await deleteData(req.body);
        
            res.send(JSON.stringify(myData));
        
           }
        
           deleteTable();
        
        // console.log(JSON.stringify(req.body, null, 4));
        res.send(JSON.stringify({"status":"Success"}))

        

    }catch{
        res.send(JSON.stringify({"status":"ERROR"}))
        //need to handle invalid data scenerio


    }
})


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

}

module.exports = {runServer};