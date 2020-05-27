const express = require("express");
const router = express.Router();
const Book = require("../models").Book;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}

// To render the errors.pug.
var createError = require("http-errors");


//Main books index page

router.get("/", function (req, res, next) {
  res.redirect("/books");
});

//index of books
router.get(
  "/books",
  asyncHandler(async (req, res) => {
    books = await Book.findAll();
    res.render("index", { books, title: "Library App" });
  })
);

// up date the book
router.get("/books/update", (req, res, next) => {
  res.render("update-book");
});

// new book

router.get("/books/new", (req, res) => {
  res.render("new-book", { book: {}, title: "New Book" });
});

// Post a new book

router.post(
  "/books/new",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render("new-book", { book, errors: error.errors });
      } else {
        throw error;
      }
    }
  })
);

//Find the book to update

router.get(
  "/books/:id",
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book, title: book.title });
    } else {
      next(createError(500));
    }
  })
);

//update the book

router.post(
  "/books/:id",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books");
      } else {
        res.sendStatus(500);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render("update-book", { book, errors: error.errors });
      }
    }
  })
);
// delete the book

router.post(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect("/books");
    res.redirect("/delete");
  })
);

module.exports = router;
