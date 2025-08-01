const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    const userExists = users.some(user => user.username === username);
  
    if (userExists) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});
  
// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const filteredBooks = [];

  for (let key in books) {
    if (books[key].author === author) {
      filteredBooks.push({ isbn: key, ...books[key] });
    }
  }

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const filteredBooks = [];

  for (let key in books) {
    if (books[key].title === title) {
      filteredBooks.push({ isbn: key, ...books[key] });
    }
  }

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
// ----------------------------
// PROMISE CALLBACKS START HERE
// ----------------------------

// Task 10: Get all books (Promise callback)
public_users.get('/books-promise', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject("Books not found");
      }
    });
  
    getBooks
      .then(data => res.status(200).json(data))
      .catch(err => res.status(500).json({ message: err }));
  });
  
  // Task 11: Get book by ISBN (Promise callback)
  public_users.get('/books-promise/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    const getBook = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    });
  
    getBook
      .then(data => res.status(200).json(data))
      .catch(err => res.status(404).json({ message: err }));
  });
  
  // Task 12: Get books by author (Promise callback)
  public_users.get('/books-promise/author/:author', function (req, res) {
    const author = req.params.author;
  
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const filtered = Object.keys(books)
        .filter(key => books[key].author === author)
        .map(key => ({ isbn: key, ...books[key] }));
  
      if (filtered.length > 0) {
        resolve(filtered);
      } else {
        reject("No books found by this author");
      }
    });
  
    getBooksByAuthor
      .then(data => res.status(200).json(data))
      .catch(err => res.status(404).json({ message: err }));
  });
  
  // Task 13: Get books by title (Promise callback)
  public_users.get('/books-promise/title/:title', function (req, res) {
    const title = req.params.title;
  
    const getBooksByTitle = new Promise((resolve, reject) => {
      const filtered = Object.keys(books)
        .filter(key => books[key].title === title)
        .map(key => ({ isbn: key, ...books[key] }));
  
      if (filtered.length > 0) {
        resolve(filtered);
      } else {
        reject("No books found with this title");
      }
    });
  
    getBooksByTitle
      .then(data => res.status(200).json(data))
      .catch(err => res.status(404).json({ message: err }));
  });

  


module.exports.general = public_users;
