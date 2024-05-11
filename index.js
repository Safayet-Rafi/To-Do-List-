const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('client'));

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


app.post('/register', (req, res) => {
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