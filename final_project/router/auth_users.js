const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    return users.filter((item) => (item.username == username && item.password == password)).length == 1
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const data = req.body;
    if(data.username && data.password){
        if(authenticatedUser(data.username,data.password)){
            var token = jwt.sign({ username: data.username }, 'bookreviewtoken', { expiresIn: 60 * 60 });
            req.session.authorization = {'accessToken' : token};
            res.send('login successfuly!');
        }else{
            res.send('User Not Found');
        }
    }
    res.send('Please enter username and password');
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    books[req.params.isbn].reviews[req.user.username] = req.body.review;
    res.send('Review Added [" '+ req.body.review +' "]');
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    review  = books[req.params.isbn].reviews[req.user.username];
    delete books[req.params.isbn].reviews[req.user.username]; 
    res.send('Review Removed [" '+ review +' "]');
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
