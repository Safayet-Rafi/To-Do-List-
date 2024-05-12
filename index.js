const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('./client'));

//session for each user
const secretKey = 'my_secret_key';
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
}));


//database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'To_Do_List'
});

db.connect( (error) => {
  if(error){
    console.log(error)
  }else{
    console.log("MYSQL Connected")
  }
});


app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});

//for registration
app.post('/auth/register', (req, res) => {
    const {username,email,password} = req.body;
    
    //check if the user already exist
    const query = 'SELECT * FROM user WHERE username = ?';
    db.query(query, [username], (err,result) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error' });
        
      }
      if (result.length > 0) {
        // User already exists
        res.status(400).json({ error: 'User already exists' });
      }
      else{
        // User does not exist, insert new user
        const insertQuery = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
        db.query(insertQuery, [username,email,password], (err,result) => {
          if (err) {
            console.error('Error inserting user into database:', err);
            return res.status(500).json({ error: 'Internal server error' });          
          }
          console.log('User registered successfully');
          return res.status(200).json({ message: 'User registered successfully' });
        });
      }
    }); 
});
//

//for login
app.post('/auth/login', (req,res) => {

    const {username,password} = req.body;
    
    //check if the user exist in the database
    const query = 'SELECT * FROM user WHERE username = ?';
    db.query(query, [username], (err,result) => {
        
        //server error
        if(err){
          console.error('Error querying database: ', err);
          return res.status(500).json({error: 'Internal server error'});
        }

        //User not found
        if(result.length === 0){
          return res.status(404).json({error: 'User not found'});
        }

        //check if the password is correct
        const user = result[0];
        if(user.password !== password){
          return res.status(401).json({error: 'Incorrect password'});
        }
        
        //Password is correct, now generate JWT Token
        const token = jwt.sign({username: user.username, email: user.email}, secretKey , {expiresIn: '1h'});

        // Store the token in the session
        req.session.authToken = token;

        //Send the JWT token to the client
        res.status(200).json({token});
    })

})
//


//routes for home
app.get('/home', (req, res) => {

  const token = req.session.authToken;
    if (!token) {
        return res.status(401).json({ error: 'Not Authorized' });
    }

    res.sendFile(path.join(__dirname, 'client', 'home.html'));
});