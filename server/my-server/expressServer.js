const express       = require('express')
const app           = express()
const path          = require('path')
const bodyParser    = require('body-parser')
const session       = require('express-session')
const passport      = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { getAllData, postData, putData, getJobTable } = require('../Database/db.js');


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

const sequelizeSessionStore = new MySqlStore({db: sequelize})
  

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
    callbackURL: 'http://localhost:3000/auth/success',
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    passReqToCallback: true
  },
  function verify(req, accessToken, refreshToken, profile, cb)
  {
    console.log('Logged in for %j}', profile.emails)
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
    res.sendFile(__dirname + '/index.html')
    // res.sendFile(path.join(__dirname, '../build/index.html'))
})

app.post('/', (req, res)=>{
    //console.log("Post Request Recieved" + ` ${req}`)
    //res.redirect('/login/google')
})

app.get('/auth/isLoggedInCheck', (req, res)=>{
    if (req.isAuthenticated()) {
        res.send({"result": "true"})
      } else {
        res.send({"result": "false"})
      }
})

app.get('/auth/login/google',
 passport.authenticate('google', {scope: ['profile', 'email'], failureRedirect: ['/']}))

app.get(
    '/auth/success',
    passport.authenticate('google', {scope: ['profile', 'email'], failureRedirect: ['/']}),
    (req, res)=>{
        const string = [{
            "loginStatus":"true"
        }]
        // console.log(__dirname)
        //res.send(JSON.stringify(string))
        res.sendFile(path.join(__dirname, '../build/index.html'))
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

app.get('/getKeyTable', (req, res)=>{

   const getTable = async() => {
       
    let keyTable = await JobTable.findAll({
        attributes: { exclude: [ 'createdAt', 'updatedAt', 'smithID'] },
        raw: true
    });

    // console.log(`Database result:  + ${JSON.stringify(keyTable)}`);

    res.send(JSON.stringify(keyTable));

   }

   getTable();

})

app.get('/updateJobTable',(req, res)=>{
    console.log('PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP')
    console.log('updateJobTable : ' + req.body)


})

app.put('/test', isLoggedIn, (req, res)=>{
    console.log('****************************************')

    console.log(req.body)

    console.log('****************************************')

})



const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

}

module.exports = {runServer};