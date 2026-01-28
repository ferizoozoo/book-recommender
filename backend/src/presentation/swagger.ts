import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Book Recommender API",
    description:
      "API for a book recommendation system with user authentication and library management",
    version: "1.0.0",
  },
  host: "localhost:5000",
  basePath: "/",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      scheme: "bearer",
      in: "header",
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  definitions: {
    LoginRequest: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          format: "email",
          description: "User email address",
        },
        password: {
          type: "string",
          description: "User password",
        },
      },
    },
    RegisterRequest: {
      type: "object",
      required: ["email", "password", "retypePassword"],
      properties: {
        email: {
          type: "string",
          format: "email",
          description: "User email address",
        },
        password: {
          type: "string",
          description: "User password",
        },
        retypePassword: {
          type: "string",
          description: "Confirm password",
        },
      },
    },
    RefreshTokenRequest: {
      type: "object",
      required: ["refreshToken"],
      properties: {
        refreshToken: {
          type: "string",
          description: "Refresh token for obtaining a new access token",
        },
      },
    },
    UpdateProfileRequest: {
      type: "object",
      properties: {
        firstName: {
          type: "string",
          description: "User first name",
        },
        lastName: {
          type: "string",
          description: "User last name",
        },
        email: {
          type: "string",
          format: "email",
          description: "User email address",
        },
      },
    },
    CreateUserRequest: {
      type: "object",
      required: ["firstName", "lastName", "email", "password"],
      properties: {
        firstName: {
          type: "string",
          description: "User first name",
        },
        lastName: {
          type: "string",
          description: "User last name",
        },
        email: {
          type: "string",
          format: "email",
          description: "User email address",
        },
        password: {
          type: "string",
          description: "User password",
        },
      },
    },
    UpdateUserRequest: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "integer",
          description: "User ID",
        },
        firstName: {
          type: "string",
          description: "User first name",
        },
        lastName: {
          type: "string",
          description: "User last name",
        },
        email: {
          type: "string",
          format: "email",
          description: "User email address",
        },
        password: {
          type: "string",
          description: "User password",
        },
      },
    },
    DeleteUserRequest: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "integer",
          description: "User ID to delete",
        },
      },
    },
    AddAuthorRequest: {
      type: "object",
      required: ["bio"],
      properties: {
        bio: {
          type: "string",
          description: "Author biography",
        },
        image: {
          type: "string",
          description: "Author image URL",
        },
      },
    },
    UpdateAuthorRequest: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          description: "Author ID",
        },
        bio: {
          type: "string",
          description: "Author biography",
        },
        image: {
          type: "string",
          description: "Author image URL",
        },
      },
    },
    AddPublisherRequest: {
      type: "object",
      required: ["name", "address", "city", "state", "zip", "country"],
      properties: {
        name: {
          type: "string",
          description: "Publisher name",
        },
        address: {
          type: "string",
          description: "Publisher street address",
        },
        city: {
          type: "string",
          description: "Publisher city",
        },
        state: {
          type: "string",
          description: "Publisher state/province",
        },
        zip: {
          type: "string",
          description: "Publisher zip/postal code",
        },
        country: {
          type: "string",
          description: "Publisher country",
        },
      },
    },
    UpdatePublisherRequest: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Publisher name",
        },
        address: {
          type: "string",
          description: "Publisher street address",
        },
        city: {
          type: "string",
          description: "Publisher city",
        },
        state: {
          type: "string",
          description: "Publisher state/province",
        },
        zip: {
          type: "string",
          description: "Publisher zip/postal code",
        },
        country: {
          type: "string",
          description: "Publisher country",
        },
      },
    },
    AddBookRequest: {
      type: "object",
      required: ["title", "authorId", "publisherId", "isbn"],
      properties: {
        title: {
          type: "string",
          description: "Book title",
        },
        authorId: {
          type: "integer",
          description: "Author ID",
        },
        publisherId: {
          type: "integer",
          description: "Publisher ID",
        },
        isbn: {
          type: "string",
          description: "Book ISBN",
        },
        quantity: {
          type: "integer",
          description: "Book quantity in stock",
        },
        publishedDate: {
          type: "string",
          format: "date-time",
          description: "Book publication date",
        },
        description: {
          type: "string",
          description: "Book description",
        },
      },
    },
    UpdateBookRequest: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Book title",
        },
        description: {
          type: "string",
          description: "Book description",
        },
        isbn: {
          type: "string",
          description: "Book ISBN",
        },
        year: {
          type: "integer",
          description: "Book publication year",
        },
        image: {
          type: "string",
          description: "Book cover image URL",
        },
        quantity: {
          type: "integer",
          description: "Book quantity in stock",
        },
        publishedDate: {
          type: "string",
          format: "date-time",
          description: "Book publication date",
        },
        authorId: {
          type: "integer",
          description: "Author ID",
        },
        publisherId: {
          type: "integer",
          description: "Publisher ID",
        },
      },
    },
    AddLabelRequest: {
      type: "object",
      required: ["label"],
      properties: {
        label: {
          type: "string",
          description: "Label to add to the book",
        },
      },
    },
    RemoveLabelRequest: {
      type: "object",
      required: ["label"],
      properties: {
        label: {
          type: "string",
          description: "Label to remove from the book",
        },
      },
    },
    GetFilteredBooksRequest: {
      type: "object",
      properties: {
        year: {
          type: "integer",
          description: "Book publication year filter",
        },
        author: {
          type: "string",
          description: "Author name filter",
        },
        title: {
          type: "string",
          description: "Book title filter",
        },
      },
    },
    AddReviewRequest: {
      type: "object",
      required: ["rating"],
      properties: {
        rating: {
          type: "number",
          description: "Review rating",
        },
        review: {
          type: "string",
          description: "Review text",
        },
      },
    },
    LikeToggleRequest: {
      type: "object",
      required: ["bookId"],
      properties: {
        bookId: {
          type: "integer",
          description: "Book ID to like/unlike",
        },
      },
    },
    TokenResponse: {
      type: "object",
      properties: {
        token: {
          type: "string",
          description: "JWT authentication token",
        },
      },
    },
    MessageResponse: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Response message",
        },
      },
    },
  },
};

const outputFile = "./src/presentation/swagger-output.json";
const routes = ["./src/presentation/routes/index.ts"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);
