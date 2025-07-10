const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  for(i in users){
      if(users[i].username===username){
          return false;
          
      }
    }
    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

for(i in users){
  if(users[i].username===username){
    if(users[i].password===password){
      return true;
      
    }
  }
 
}
 return false;

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password=req.body.password;

  console.log(users);

  console.log(username);
  console.log(password);
  if(authenticatedUser(username,password)){
    let token=jwt.sign({name:username, pass:password},"secret-key-1234",{expiresIn:"1h"})
     req.session.authorization = {
      accessToken: token,username: username
    };
    return res.status(300).json({message: "Succesfully logged in",token});
  }
 else{
  return res.status(300).json({message: "Sorry Incorrect Credentials"});
 }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization?.username;
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book does not exist" });
  }

  const isUpdate = !!books[isbn].reviews[username];
  books[isbn].reviews[username] = review;

  console.log(books);
  return res.status(200).json({
    message: isUpdate ? "Review Updated" : "Review Added",
    reviews: books[isbn].reviews
  });


});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization?.username;
  const isbn = req.params.isbn;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book does not exist" });
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "You have not posted a review for this book" });
  }

  
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Your review has been deleted",
    reviews: books[isbn].reviews
  });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
