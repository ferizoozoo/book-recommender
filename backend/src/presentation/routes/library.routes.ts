import { Router } from "express";
import { libraryController } from "../di/setup.ts";

const libraryRouter = Router();

// Book management routes
libraryRouter.get("/", async (req, res, next) => {
  await libraryController.getAllBooks(req, res, next);
});

libraryRouter.get("/search", async (req, res, next) => {
  await libraryController.searchBooks(req, res, next);
});

libraryRouter.get("/label", async (req, res, next) => {
  await libraryController.getBooksByLabel(req, res, next);
});

libraryRouter.get("/:id", async (req, res, next) => {
  await libraryController.getBookById(req, res, next);
});

libraryRouter.get("/isbn/:isbn", async (req, res, next) => {
  await libraryController.getBookByIsbn(req, res, next);
});

libraryRouter.post("/", async (req, res, next) => {
  await libraryController.addBook(req, res, next);
});

libraryRouter.put("/:id", async (req, res, next) => {
  await libraryController.updateBook(req, res, next);
});

libraryRouter.delete("/:id", async (req, res, next) => {
  await libraryController.deleteBook(req, res, next);
});

// Label management routes
libraryRouter.post("/:id/label", async (req, res, next) => {
  await libraryController.addLabelToBook(req, res, next);
});

libraryRouter.delete("/:id/label", async (req, res, next) => {
  await libraryController.removeLabelFromBook(req, res, next);
});

// Order management routes
libraryRouter.post("/:id/order", async (req, res, next) => {
  await libraryController.orderBook(req, res, next);
});

libraryRouter.post("/:id/return", async (req, res, next) => {
  await libraryController.returnBook(req, res, next);
});

libraryRouter.post("/authors", async (req, res, next) => {
  await libraryController.addAuthor(req, res, next);
});

libraryRouter.post("/publishers", async (req, res, next) => {
  await libraryController.addPublisher(req, res, next);
});

export default libraryRouter;
