import http from 'http';
import fs from 'fs';

let users = JSON.parse(fs.readFileSync("users.json"));
let books = JSON.parse(fs.readFileSync("books.json"));


// Users Routes: CreateUser - POST, AuthenticateUser - POST, getAllUsers - GET

const handleRequest = (req, res) => {
    const { method, url } = req;

    // Route for creating a new user
    if (method === 'POST' && url === '/u/create') {
        let body = '';
        req.on('data', (userInput) => {
            body += userInput.toString();
        });

        req.on('end', () => {
            const newUser = JSON.parse(body);
            const user = users.find(u => u.id === newUser.id);
            if (!user) {
                users.push(newUser);
                fs.writeFileSync('users.json', JSON.stringify(users));
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User created successfully' }));
            } else {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User with that id already exist' }));
            }
        });
    }

    // Route for authenticating a user
    else if (method === 'POST' && url === '/u/authenticate') {
        let body = '';
        req.on('data', (userInput) => {
            body += userInput.toString();
        });
        req.on('end', () => {
            const { username, password } = JSON.parse(body);
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Authentication successful' }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Authentication failed' }));
            }
        });
    }

    // Route for getting all users
    else if (method === 'GET' && url === '/u/users') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    }

    // Route for creating a new book
    else if (url === '/books/create' && method === 'POST') {
        let body = '';
        req.on('data', (book) => {
            body += book.toString();
        });
        req.on('end', () => {
            const newBook = JSON.parse(body);
            const book = books.find(b => b.id === newBook.id);
            if (!book) {
                books.push(newBook);
                fs.writeFileSync('books.json', JSON.stringify(books));
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Book created successfully' }));
            } else {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Book with that id already exist' }));
            }

        });
    }

    // Route for deleting a book
    else if (method === 'DELETE' && /^\/books\/delete\/\d+$/.test(url)) {
        const id = parseInt(url.split('/').pop());
        const bookIndex = books.findIndex(book => book.id === id);

        if (bookIndex !== -1) {
            books.splice(bookIndex, 1);
            fs.writeFileSync('books.json', JSON.stringify(books));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Book with id ${id} deleted successfully` }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Book with id ${id} not found` }));
        }
    }

    // Route for loan out
    else if (url === '/books/loanOut' && method === 'POST') {
        let body = '';
        req.on('data', (clientInput) => {
            body += clientInput.toString();
        })

        req.on('end', () => {
            const { id, borrower } = JSON.parse(body);
            const book = books.find(b => b.id === id);

            if (book && book.status === "available") {
                book.status = 'loaned';
                book.borrower = borrower;

                fs.writeFileSync('books.json', JSON.stringify(books));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: `Book with id ${id} loaned out to ${borrower}` }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: `Book with id ${id} not found or not available` }));
            }
        });
    }

    //route for return

    else if (url === '/books/return' && method === 'POST') {
        let body = '';
        req.on('data', (clientInput) => {
            body += clientInput.toString();
        })

        req.on('end', () => {
            const { id, borrower } = JSON.parse(body);
            const book = books.find(b => b.id === id
            );


            if (book && book.status === "loaned") {
                book.status = 'available';
                delete book.borrower;

                fs.writeFileSync('books.json', JSON.stringify(books));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: `Book with id ${id} was returned by ${borrower}` }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: `Loaned book with this ID ${id} is not found or not loaned!` }));
            }
        });

    }

    //route for update

    else if (method === 'PUT' && /^\/books\/update\/\d+$/.test(url)) {
        let body = '';
        req.on('data', (book) => {
            body += book.toString();
        });
        req.on('end', () => {
            const updatedBook = JSON.parse(body);
            const id = parseInt(url.split('/').pop());
            const book = books.find(b => b.id === id);

            if (book) {
                book.title = updatedBook.title;
                book.author = updatedBook.author;
                book.isbn = updatedBook.isbn;
                book.status = updatedBook.status;
                book.borrower = updatedBook.borrower;

                fs.writeFileSync('books.json', JSON.stringify(books));
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: `Book with id ${id} updated successfully` }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: `Book with id ${id} not found` }));
            }
        });
    }

    // Default route for unsupported requests
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Route not found');
    }
}

// Create a new server (i.e index.js)
const server = http.createServer(handleRequest)

const port = 100;
server.listen(port, () => {
    console.log('Server is running on http://localhost:' + port)
})