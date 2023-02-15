const express       = require('express');
let books           = require("./booksdb.js");
let isValid         = require("./auth_users.js").isValid;
let users           = require("./auth_users.js").users;
const axios         = require('axios');

const public_users  = express.Router();
const baseUrl           = "https://mhoabedi-5000.theiadocker-3-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/";

public_users.post("/register", (req,res) => {
  let data = req.body;
  if(data.username && data.password){
      if(users.filter((item) => item.username == data.username).length > 0){
          res.send('User Already Exist.');
      }else{
        users.push(data);
        res.send('Register successfuly.');
      }
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    res.send(JSON.stringify(books[req.params.isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let newBooks = Object.values(books).filter(function(item) {
        return item.author == req.params.author;
    });
    res.send(JSON.stringify(newBooks));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let newBooks = Object.values(books).filter(function(item) {
        return item.title == req.params.title;
    });
    res.send(JSON.stringify(newBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    res.send(JSON.stringify(books[req.params.isbn].reviews));
});

// Get book list using axios
public_users.get('/books',async function (req, res) {
    const books1 = await getBooks(baseUrl,1);
    // const books2 = await getBooks(baseUrl,2);
    // const books3 = await getBooks(baseUrl,3);
    res.send(books1.data);
});
// Get book by isbn using axios
public_users.get('/async_isbn/:isbn',async function (req, res) {
    const books = await getBooks(baseUrl + '/isbn/'+req.params.isbn);
    res.send(books.data);
});
// Get book by authod using axios
public_users.get('/async_author/:author',async function (req, res) {
    const books = await getBooks(baseUrl + '/author/'+req.params.author);
    res.send(books.data);
});
// Get book by title using axios
public_users.get('/async_title/:title',async function (req, res) {
    const books = await getBooks(baseUrl + '/title/'+req.params.title);
    res.send(books.data);
});
async function getBooks(base_url,it = 0) {
    // console.log(it +' called at'+ new Date())
    try {
       const response =  await axios.get(base_url);
       return response;
    } catch (error) {
        return error;
    }
}

module.exports.general = public_users;
