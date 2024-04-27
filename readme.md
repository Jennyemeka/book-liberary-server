
# My Book Library Server

This project is a simple Node.js server for managing a book library. It provides basic CRUD (Create, Read, Update, Delete) operations for users and books, with data stored in JSON files.

## Features

- **User Management:**
  - Create a new user
  - Authenticate user login
  - Get all users

- **Book Management:**
  - Create a new book
  - Delete a book
  - Loan out a book
  - Return a book
  - Update book information

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/my-book-library-server.git
   ```

2. Install dependencies:
   ```bash
   cd my-book-library-server
   npm install
   ```

3. Run the server:
   ```bash
   node index.js
   ```

4. Access the server at `http://localhost:100` in your web browser.

## Routes

The server provides the following routes:

- **Users:**
  - POST /u/create - Create a new user
  - POST /u/authenticate - Authenticate user login
  - GET /u/users - Get all users

- **Books:**
  - POST /createBook - Create a new book
  - DELETE /books/delete/:id - Delete a book by ID
  - POST /books/loanOut/:id - Loan out a book by ID
  - POST /books/return/:id - Return a book by ID
  - PUT /books/udpate/:id - Update book information by ID

## File Structure

The project has the following file structure:

```
my-book-library-server/
│
├── index.js           # Main server file
├── users.json         # JSON file to store user data
└── books.json         # JSON file to store book data
```