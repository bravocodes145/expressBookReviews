const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios=require('axios')



public_users.post("/register", (req,res) => {
  const name=req.body.username;
  const password=req.body.password;

  console.log(name);
  console.log(password)
  if((name===undefined || name==="") && (password===undefined || password==="")){
   return res.status(400).send({message : 'please enter a username and a password'})
  }
  if(name===undefined || name===""){
   return res.status(400).send({message :'please enter a username'})
  }
  if(password===undefined || password===""){
   return res.status(400).send({message :'please enter a password'})
  }
 
  else{
  if(isValid(name)){
users.push({username:name,password:password})
    return res.status(206).send({message :'user created successfully'});
  }
  else{
    return res.status(206).send({message :'thus username already exists please enter a different username'});
  }
    
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
  if(books[req.params.isbn]){
    res.status(200).json(books[req.params.isbn]);
  
  }
  else{
    res.status(400).json({message: 'book not found'})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {

  let results = [];

  for (let id in books) {
    if (books[id].author.toLowerCase()=== req.params.author.toLowerCase()) {
      results.push({ id, ...books[id] });
    }
  }

  if (results.length === 0) {
    return res.status(404).send({ message: "No books found for this author." });
  }

  return res.status(200).send(results);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  for (let id in books) {
    if (books[id].title.toLowerCase()=== req.params.title.toLowerCase()) {
      
  return res.status(200).send(books[id]);
    }
  }

  
    return res.status(404).send({ message: "No books found for this title." });
  

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    const reviews = books[isbn].reviews;

    if (Object.keys(reviews).length === 0) {
      return res.status(203).json({ message: 'This book has no reviews' });
    } else {
      return res.status(200).json(reviews);
    }
  } else {
    return res.status(404).json({ message: 'This book does not exist' });
  }
});



//task 10
public_users.get('/fetchbooks',async(req,res)=>{
try{
const responce = await axios.get('http://localhost:5000/');
return res.json(responce.data);
}
catch(err){
  return res.json({message: 'could not fetch response, ',err})
}

})

//task 11

public_users.get('/fetchbooks/isbn/:isbn',async(req,res)=>{
const isbn = req.params.isbn;
try{
const responce = await axios.get(`http://localhost:5000/isbn/${isbn}`);
return res.json(responce.data);
}
catch(err){
  return res.json({message: 'could not fetch response, ',err})
}

})

//task 12

public_users.get('/fetchbooks/author/:author',async(req,res)=>{
const author = req.params.author;
try{
const responce = await axios.get(`http://localhost:5000/author/${author}`);
return res.json(responce.data);
}
catch(err){
  return res.json({message: 'could not fetch response, ',err})
}

})

//task 13

public_users.get('/fetchbooks/title/:title',async(req,res)=>{
const title = req.params.title;
try{
const responce = await axios.get(`http://localhost:5000/title/${title}`);
return res.json(responce.data);
}
catch(err){
  return res.json({message: 'could not fetch response, ',err})
}

})


module.exports.general = public_users;
