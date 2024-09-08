const express = require("express");
const router = express.Router();
const books = require("../../models");
const fileMiddleware = require("../../middleware/file");
const fs = require("fs");

let store = {
  user: {
    id: 0,
    login: "test",
    mail: "test@mail.ru",
  },
  library: [],
};

for (let i = 0; i < 3; i++) {
  const book = new books();
  store.library.push(book);
  fs.appendFile(
    __dirname + `/../../public/${book.fileBook}.txt`,
    `${book.id}`,
    (err) => {
      if (err) throw err;
    }
  );
}

router.get("/", (req, res) => {
  res.render("books/index", { title: "Книги", library: store.library });
});
router.get("/create", (req, res) => {
  res.render("books/create", { title: "Library | Создать книгу", book: {} });
});
router.post("/create", (req, res) => {
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  const book = new books(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  );
  console.log(book);
  store.library.push(book);
  res.redirect("/library");
});
router.get("/update/:id", (req, res) => {
  const { id } = req.params;
  const idx = store.library.findIndex((el) => el.id === id);

  if (idx !== -1) {
    res.render("books/update", {
      title: "Library | Книга",
      book: store.library[idx],
    });
  } else res.status(404).redirect("/404");
});
router.post("/update/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
  const idx = store.library.findIndex((el) => el.id === id);

  if (idx !== -1) {
    store.library[idx] = {
      ...store.library[idx],
      title: title,
      description: description,
      authors: authors,
      favorite: favorite,
      fileCover: fileCover,
      fileName: fileName,
    };
    res.redirect(`/library/${id}`);
  } else {
    res.status(404).redirect("/library/404");
  }
});
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const idx = store.library.findIndex((el) => el.id === id);

  if (idx !== -1) {
    res.render("books/view", {
      title: "Library | Обзор",
      book: store.library[idx],
    });
  } else {
    res.status(404).redirect("/404");
  }
});
router.post("/delete/:id", (req, res) => {
  const { id } = req.params;
  const idx = store.library.findIndex((el) => el.id === id);

  if (idx !== -1) {
    store.library.splice(idx, 1);
    res.redirect("/library");
  } else {
    res.status(404).redirect("/404");
  }
});
router.post("/upload", fileMiddleware.single("books"), (req, res) => {
  if (req.file) {
    const { path } = req.file;
    console.log(path);

    res.json(path);
  } else {
    res.json(null);
  }
});
router.get("/:id/download", (req, res) => {
  const { id } = req.params;

  const object = store.library.filter((el) => el.id === id);

  if (object) {
    res.download(
      __dirname + `/../public/${object[0].fileBook}.txt`,
      "cover.txt",
      (err) => {
        if (err) res.status(404).json;
      }
    );
  } else {
    res.status(404).json("NOT FOUND FILE");
  }
});

module.exports = router;