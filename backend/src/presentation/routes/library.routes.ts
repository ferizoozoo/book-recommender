import { Router } from "express";
import { libraryController } from "../di/setup.ts";

const libraryRouter = Router();

// Book management routes
libraryRouter.get("/books", async (req, res, next) => {
  await libraryController.getAllBooks(req, res, next);
});

libraryRouter.get("/authors", async (req, res, next) => {
  await libraryController.getAllAuthors(req, res, next);
});

libraryRouter.get("/publishers", async (req, res, next) => {
  await libraryController.getAllPublishers(req, res, next);
});

// TODO: this is for the 'what readers say?' section
libraryRouter.get("/readers-review", async (req, res, next) => {
  await libraryController.getReadersReviewBooks(req, res, next);
});

libraryRouter.post("/search", async (req, res, next) => {
  await libraryController.getFilteredBooks(req, res, next);
});

libraryRouter.get("/trending", async (req, res, next) => {
  await libraryController.getTrendingBooks(req, res, next);
});

libraryRouter.get("/label", async (req, res, next) => {
  await libraryController.getBooksByLabel(req, res, next);
});

// libraryRouter.get("/:id", async (req, res, next) => {
//   await libraryController.getBookById(req, res, next);
// });

libraryRouter.get("/isbn/:isbn", async (req, res, next) => {
  await libraryController.getBookByIsbn(req, res, next);
});

libraryRouter.get("/user", async (req, res, next) => {
  await libraryController.getAllBooksForUser(req, res, next);
});

libraryRouter.post("/books", async (req, res, next) => {
  await libraryController.addBook(req, res, next);
});

libraryRouter.put("/books/:id", async (req, res, next) => {
  await libraryController.updateBook(req, res, next);
});

libraryRouter.delete("/books/:id", async (req, res, next) => {
  await libraryController.deleteBook(req, res, next);
});

// Label management routes
libraryRouter.post("/books/:id/label", async (req, res, next) => {
  await libraryController.addLabelToBook(req, res, next);
});

libraryRouter.delete("/books/:id/label", async (req, res, next) => {
  await libraryController.removeLabelFromBook(req, res, next);
});

libraryRouter.post("/authors", async (req, res, next) => {
  await libraryController.addAuthor(req, res, next);
});

libraryRouter.post("/publishers", async (req, res, next) => {
  await libraryController.addPublisher(req, res, next);
});

libraryRouter.put("/authors/:id", async (req, res, next) => {
  await libraryController.updateAuthor(req, res, next);
});

libraryRouter.put("/publishers/:id", async (req, res, next) => {
  await libraryController.updatePublisher(req, res, next);
});

export default libraryRouter;
