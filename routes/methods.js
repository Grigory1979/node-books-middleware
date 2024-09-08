const express = require("express");
const router = express.Router();
const books = require("../models");
const fileMiddleware = require("../middleware/file");
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
    __dirname + `/../public/${book.fileBook}.txt`,
    `${book.id}`,
    (err) => {
      if (err) throw err;
    }
  );
}

router.post("/login", (req, res) => {
  res.status(201).json(store.user);
});
router.get("/", (req, res) => {
  const library = store.library;
  res.json(library);
});
router.get("/:id", (req, res) => {
  const library = store.library;
  const { id } = req.params;
  const idx = library.findIndex((el) => el.id === id);
  idx !== -1 ? res.json(library[idx]) : res.status(404).json("NOT FOUND");
});
router.post("", (req, res) => {
  const { ...args } = req.body;
  console.log(...args);
  const book = new books({ ...args });
  store.library.push(book);

  res.status(201);
  res.json(book);
});
router.put("/:id", (req, res) => {
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
    res.json(store.library[idx]);
  } else {
    res.status(404).json("NOT FOUND");
  }
});
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const idx = store.library.findIndex((el) => el.id === id);

  if (idx !== -1) {
    store.library.splice(idx, 1);
    res.json(true);
  } else {
    res.status(404).json("NOT FOUND");
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