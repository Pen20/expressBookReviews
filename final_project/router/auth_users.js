const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if username is already taken
const isValid = (username) => {
  return users.some(user => user.username === username);
}

// Authenticate user by username and password
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

// Task 7: Login a registered user
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Store in session
  req.session.username = username;

  // Optional: create JWT token
  const accessToken = jwt.sign({ username }, 'access_secret', { expiresIn: '1h' });

  return res.status(200).json({ message: "Login successful", token: accessToken });
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.username;

  if (!username) {
    return res.status(403).json({ message: "Login required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added/updated successfully" });
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;

  if (!username) {
    return res.status(403).json({ message: "Login required" });
  }

  if (books[isbn] && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found for this user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
