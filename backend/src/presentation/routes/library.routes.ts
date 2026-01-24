import { Router } from "express";
import { libraryController } from "../di/setup.ts";

const libraryRouter = Router();

/**
 * @openapi
 * /library/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of all books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
libraryRouter.get("/books", async (req, res, next) => {
  await libraryController.getAllBooks(req, res, next);
});

/**
 * @openapi
 * /library/authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: List of all authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 */
libraryRouter.get("/authors", async (req, res, next) => {
  await libraryController.getAllAuthors(req, res, next);
});

/**
 * @openapi
 * /library/publishers:
 *   get:
 *     summary: Get all publishers
 *     tags: [Publishers]
 *     responses:
 *       200:
 *         description: List of all publishers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Publisher'
 */
libraryRouter.get("/publishers", async (req, res, next) => {
  await libraryController.getAllPublishers(req, res, next);
});

/**
 * @openapi
 * /library/readers-review:
 *   get:
 *     summary: Get books with readers reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of books with reader reviews
 */
libraryRouter.get("/readers-review", async (req, res, next) => {
  await libraryController.getReadersReviewBooks(req, res, next);
});

/**
 * @openapi
 * /library/user-review/{bookId}:
 *   get:
 *     summary: Get user review for a specific book
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The book ID
 *     responses:
 *       200:
 *         description: User review for the book
 *       404:
 *         description: Review not found
 */
libraryRouter.get("/user-review/:bookId", async (req, res, next) => {
  await libraryController.getUserReviewForBook(req, res, next);
});

/**
 * @openapi
 * /library/search:
 *   post:
 *     summary: Search and filter books
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               authorId:
 *                 type: integer
 *               publisherId:
 *                 type: integer
 *               label:
 *                 type: string
 *     responses:
 *       200:
 *         description: Filtered list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
libraryRouter.post("/search", async (req, res, next) => {
  await libraryController.getFilteredBooks(req, res, next);
});

/**
 * @openapi
 * /library/trending:
 *   get:
 *     summary: Get trending books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of trending books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
libraryRouter.get("/trending", async (req, res, next) => {
  await libraryController.getTrendingBooks(req, res, next);
});

/**
 * @openapi
 * /library/label:
 *   get:
 *     summary: Get books by label
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: label
 *         required: true
 *         schema:
 *           type: string
 *         description: The label to filter by
 *     responses:
 *       200:
 *         description: List of books with the specified label
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
libraryRouter.get("/label", async (req, res, next) => {
  await libraryController.getBooksByLabel(req, res, next);
});

/**
 * @openapi
 * /library/isbn/{isbn}:
 *   get:
 *     summary: Get book by ISBN
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *         description: The book ISBN
 *     responses:
 *       200:
 *         description: Book details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
libraryRouter.get("/isbn/:isbn", async (req, res, next) => {
  await libraryController.getBookByIsbn(req, res, next);
});

/**
 * @openapi
 * /library/user:
 *   get:
 *     summary: Get all books for the authenticated user
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized
 */
libraryRouter.get("/user", async (req, res, next) => {
  await libraryController.getAllBooksForUser(req, res, next);
});

/**
 * @openapi
 * /library/books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */
libraryRouter.get("/books/:id", async (req, res, next) => {
  await libraryController.getBookById(req, res, next);
});

/**
 * @openapi
 * /library/books:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - isbn
 *             properties:
 *               title:
 *                 type: string
 *               isbn:
 *                 type: string
 *               authorId:
 *                 type: integer
 *               publisherId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
libraryRouter.post("/books", async (req, res, next) => {
  await libraryController.addBook(req, res, next);
});

/**
 * @openapi
 * /library/books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               isbn:
 *                 type: string
 *               authorId:
 *                 type: integer
 *               publisherId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
libraryRouter.put("/books/:id", async (req, res, next) => {
  await libraryController.updateBook(req, res, next);
});

/**
 * @openapi
 * /library/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
libraryRouter.delete("/books/:id", async (req, res, next) => {
  await libraryController.deleteBook(req, res, next);
});

/**
 * @openapi
 * /library/books/{id}/label:
 *   post:
 *     summary: Add a label to a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *             properties:
 *               label:
 *                 type: string
 *     responses:
 *       200:
 *         description: Label added successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
libraryRouter.post("/books/:id/label", async (req, res, next) => {
  await libraryController.addLabelToBook(req, res, next);
});

/**
 * @openapi
 * /library/books/{id}/label:
 *   delete:
 *     summary: Remove a label from a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *             properties:
 *               label:
 *                 type: string
 *     responses:
 *       200:
 *         description: Label removed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
libraryRouter.delete("/books/:id/label", async (req, res, next) => {
  await libraryController.removeLabelFromBook(req, res, next);
});

/**
 * @openapi
 * /library/authors:
 *   post:
 *     summary: Add a new author
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Author created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
libraryRouter.post("/authors", async (req, res, next) => {
  await libraryController.addAuthor(req, res, next);
});

/**
 * @openapi
 * /library/publishers:
 *   post:
 *     summary: Add a new publisher
 *     tags: [Publishers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Publisher created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
libraryRouter.post("/publishers", async (req, res, next) => {
  await libraryController.addPublisher(req, res, next);
});

/**
 * @openapi
 * /library/authors/{id}:
 *   put:
 *     summary: Update an author
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The author ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Author updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Author not found
 */
libraryRouter.put("/authors/:id", async (req, res, next) => {
  await libraryController.updateAuthor(req, res, next);
});

/**
 * @openapi
 * /library/publishers/{id}:
 *   put:
 *     summary: Update a publisher
 *     tags: [Publishers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The publisher ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Publisher updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Publisher not found
 */
libraryRouter.put("/publishers/:id", async (req, res, next) => {
  await libraryController.updatePublisher(req, res, next);
});

/**
 * @openapi
 * /library/reviews/{bookId}:
 *   post:
 *     summary: Add a review for a book
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
libraryRouter.post("/reviews/:bookId", async (req, res, next) => {
  await libraryController.addReviews(req, res, next);
});

/**
 * @openapi
 * /library/like:
 *   post:
 *     summary: Toggle like status for a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Like status toggled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
libraryRouter.post("/like", async (req, res, next) => {
  await libraryController.likeToggle(req, res, next);
});

/**
 * @openapi
 * /library/user/liked-books:
 *   get:
 *     summary: Get all books liked by the authenticated user
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of liked books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized
 */
libraryRouter.get("/user/liked-books", async (req, res, next) => {
  await libraryController.getUserLikedBooks(req, res, next);
});

export default libraryRouter;
