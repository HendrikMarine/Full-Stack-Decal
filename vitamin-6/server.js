// server.js
require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 3000;

// Tell Express to use EJS as the view engine (looks for templates in ./views)
app.set('view engine', 'ejs');

// Allow the server to parse JSON bodies in requests
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

// ---------- Part 3: RESTful CRUD on a local array ----------

let books = [
    { id: 1, title: "The Great Gatsby" },
    { id: 2, title: "1984" }
];

// GET: Fetch all books
app.get('/books', (req, res) => {
    res.json(books);
});

// ---------- Part 5: EJS view ----------
// Declared before '/books/:id' routes so "view" is never treated as an id

app.get('/books/view', (req, res) => {
    res.render('books', { books: books });
});

// POST: Add a new book
app.post('/books', (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    // New id = one more than the current largest id (safe after deletes)
    const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
    const newBook = { id: newId, title: title };
    books.push(newBook);

    res.status(201).json(books);
});

// PATCH: Update a book's title by ID
app.patch('/books/:id', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    // req.params values are strings, so convert before comparing
    const book = books.find(b => b.id === parseInt(id));

    if (!book) {
        return res.status(404).json({ error: `Book with id ${id} not found` });
    }

    book.title = title;
    res.json(book);
});

// DELETE: Remove a book by ID
app.delete('/books/:id', (req, res) => {
    const { id } = req.params;

    books = books.filter(b => b.id !== parseInt(id));

    res.json(books);
});

// ---------- Part 6: Environment variables ----------

app.get('/secrets', (req, res) => {
    res.send(process.env.SPOTIFY_KEY);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
