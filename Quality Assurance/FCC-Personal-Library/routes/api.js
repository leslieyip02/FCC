/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGOOSE_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "LibraryDB" });


const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] },
  commentcount: { type: Number, default: 0 }
});
let Book = mongoose.model("books", bookSchema);

const librarySchema = new mongoose.Schema({
  books: [bookSchema]
});
const LibraryModel = mongoose.model("library", librarySchema);
const library = new LibraryModel;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      //console.log(library.books);
      return res.json(library.books);
    })
    
    .post(function (req, res) {
      let title = req.body.title;
      
      //response will contain new book object including atleast _id and title
      if (title) {
        Book.create({ title: title }, (err, book) => {
          if (err) return console.log(err);
          library.books.push(book);
          return res.json({
            title: book.title,
            _id: book._id
          });
        });
      } else {
        return res.send("missing required field title");
      }
    })
    
    .delete(function(req, res) {
      //if successful response will be 'complete delete successful'
      library.books = [];
      return res.send("complete delete successful");
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let foundBook;
      library.books.forEach((book) => {
        if (book._id == bookid) {
          foundBook = book;
        }
      });

      if (foundBook) {
        return res.json({
          title: foundBook.title,
          comments: foundBook.comments,
          _id: foundBook._id
        });
      } else {
        return res.send("no book exists");
      } 
    })
    
    .post(function(req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (comment) {
        let foundBook;
        library.books.forEach((book) => {
          if (book._id == bookid) {
            book.comments.push(comment);
            book.commentcount ++;
            foundBook = book;
          }
        });

        if (foundBook) {
          return res.json({
            title: foundBook.title,
            comments: foundBook.comments,
            _id: foundBook._id
          });
        } else {
          return res.send("no book exists");
        }
      } else {
        return res.send("missing required field comment");
      }
    })
    
    .delete(function(req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      let foundBook;
      library.books.forEach((book, i) => {
        if (book._id == bookid) {
          library.books.splice(i, 1);
          foundBook = true;
        }
      });

      if (foundBook) {
        return res.send("delete successful");
      } else {
        return res.send("no book exists");
      }
    });
  
};
