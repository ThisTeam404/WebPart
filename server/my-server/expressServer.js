const express       = require('express')
const app           = express()
const path          = require('path')
const bodyParser    = require('body-parser')
const session       = require('express-session')
const passport      = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { getData, createNewTuple, updateTuple, deleteData } = require('../Database/db.js');

const crypto = require('crypto')

const WEB_MODE_ENABLED = false

const PORT = process.env.PORT || 3000;
const SITE_URL = WEB_MODE_ENABLED ? 'https://web-login-test1.herokuapp.com' : 'http://localhost:' + PORT

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
const { resolveSoa } = require('dns')

const sequelizeSessionStore = new MySqlStore({db: sequelize})

const API_KEY_LENGTH = 10;

const generateAPIKey = () => {
    // generate short password for api key
    // display api key on screen if logged in
    // invalidate api key after a set amount of time
    let length = API_KEY_LENGTH
    let arrayOfRandomNum = new Uint32Array(API_KEY_LENGTH)
    crypto.webcrypto.getRandomValues(arrayOfRandomNum)
    
    let result           = "";
    let characters       = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@#$%&?";
    let charactersLength = characters.length;

    arrayOfRandomNum.forEach((value, index, arr)=>{
        result += characters.charAt(value % charactersLength)
    })

   return result;
}

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
    clientID: '486236566537-nors8u3nvf0n916l3j05bi58jd5c52u0.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: `${SITE_URL}/auth/success`,
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    passReqToCallback: true
  },
  function verify(req, accessToken, refreshToken, profile, cb)
  {
    console.log('Logged in for %j}', profile.emails)
    if (profile.id != '111540539535459025201'){
        console.log("Wrong Google Account Logged in")
    }
    else{
        console.log("Correct Google Account Logged in")
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

function isApiKeyValid(apiKeyValue){
    if(!apiKeyValue == app.locals.activeApiKey.keyValue){
        return false
    }
    return true 
}

app.post('/sendSecretStuff', function (req, res) {
    console.log(req.body['data'])
    const string = [{
    "data":"Server recievd your stuff: " + req.body['data']
    }]
    res.send(JSON.stringify(string))
});

  app.get('/t', function (req, res) {
    const string = [{
        "name": "egegegeg",
        "msg": "ASDSAD",
        "username": "asdsadsad"
    }]
    console.log(string)
    res.send(JSON.stringify(string))
  });

app.get('/', (req, res)=>{
    console.log(__dirname)
    //res.sendFile(__dirname + '/index.html')
    res.sendFile(path.join(__dirname, '../build/index.html'))
})

app.post('/', (req, res)=>{
    //console.log("Post Request Recieved" + ` ${req}`)
    //res.redirect('/login/google')
})

app.get('/auth/isLoggedInCheck', (req, res)=>{
    console.log("%j", req.body)
    console.log("%j", req.params)
    console.log("%j", req.query)
    console.log("%j", req.session)
    if (req.isAuthenticated()) {
        res.send({"result": "true"})
      } else {
        res.send({"result": "false"})
      }
})

app.get('/getAPIKey', isLoggedIn, (req, res)=>{
    // Implementation for if there can only be one api key
    const API_KEY_TIME_TO_LIVE = 1000 * 60 * 2 // ms in a second * number = how many seconds to live

    function isApiKeyValid(apiKeyInfo){
        currentTime = new Date()
        if((currentTime - apiKeyInfo.timeOfCreation) > apiKeyInfo.timeToLiveInMS){
            return false
        }
        return true
    }

    function KeyInfo(timeToLiveInMillisecond, keyValue){
        this.timeToLiveInMS = timeToLiveInMillisecond
        this.keyValue = keyValue
        this.timeOfCreation = new Date() 
    }

    if (typeof req.app.locals.activeApiKey == 'undefined' || !isApiKeyValid(req.app.locals.activeApiKey)){ 
        req.app.locals.activeApiKey = new KeyInfo(API_KEY_TIME_TO_LIVE, generateAPIKey())
    }
    
    const string = [{
        "data": req.app.locals.activeApiKey.keyValue
    }]

    console.log(req.app.locals.activeApiKey)
    res.send(JSON.stringify(string))
    
    //console.log(apiKey)

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
        console.log("isAuth? ", req.isAuthenticated())
        //res.send(JSON.stringify(string))
        //res.sendFile(path.join(__dirname, '../build/index.html'))
        res.redirect('/')
    }
)

app.post('/auth/logout', (req, res)=>{
    console.log(req.body)
    req.logOut()
    const string = {
        "data":"Successfully Logged out"
    }
    res.send(JSON.stringify(string))
})

app.get('/secret', isLoggedIn, (req, res)=>{
    const string = [{
        "data":"This is the secret data from the server"
    }]
    console.log("%j", req.body)
    console.log("%j", req.params)
    console.log("%j", req.query)
    console.log("%j", req.session)
    res.send(JSON.stringify(string))
})

app.get('/secret1', isLoggedIn, (req, res)=>{
    const string = [{
        "data":"This is the secret1 data from the server"
    }]
    res.send(JSON.stringify(string))
})

app.get('/secret2', isLoggedIn, (req, res)=>{
    const string = [{
        "data":"This is the secret2 data from the server"
    }]
    res.send(JSON.stringify(string))
})

app.get('/database', isLoggedIn, (req, res)=>{

    const startDB = async()=>{

        let sessionTB = await SessionTable.findAll();

        console.log(`Object type: ${JSON.stringify(sessionTB)}`);
        myData = JSON.stringify(sessionTB);

        const string = [{
            "data": JSON.stringify(sessionTB)
        }]
        res.send(JSON.stringify(string))

      };

      startDB();

})

app.get('/getData', (req, res)=>{

   const getTable = async() => {
    
    let myData = await getData();

    res.send(JSON.stringify(myData));

   }

   getTable();

})


app.put('/updateTuple',(req, res)=>{
    try{

    updateTuple(req.body);
    console.log(JSON.stringify(req.body, null, 4));
    res.send(JSON.stringify({"status":"Success"}))

    } catch{
        throw ("Invalid data")
        res.send()
        //need to handle invalid data scenerio
        
    }
})

app.post('/createNewTuple',(req, res)=>{
    try{

        createNewTuple(req.body);
        console.log(JSON.stringify(req.body, null, 4));
        res.send(JSON.stringify({"status":"Success"}))

    }catch{
        throw ("Invalid data")
        res.send()
        //need to handle invalid data scenerio


    }
})

app.delete('/deleteTuple',(req, res)=>{
    try{

        const deleteTable = async() => {
    
            let myData = await deleteData(req.body);
        
            res.send(JSON.stringify(myData));
        
           }
        
           deleteTable();
        
        // console.log(JSON.stringify(req.body, null, 4));
        res.send(JSON.stringify({"status":"Success"}))

        

    }catch{
        throw ("Invalid data")
        res.send()
        //need to handle invalid data scenerio


    }
})


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

}

module.exports = {runServer};