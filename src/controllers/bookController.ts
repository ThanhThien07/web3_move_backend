import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../../database.json');

// Helper để đọc/ghi DB
const readDB = () => {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
};

const writeDB = (data: any) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};

export const getBooks = async (req: Request, res: Response) => {
    try {
        const db = readDB();
        const query = req.query.q as string;
        let books = db.books || [];
        
        if (query) {
            const lowercaseQuery = query.toLowerCase();
            books = books.filter((book: any) => 
                book.title.toLowerCase().includes(lowercaseQuery) ||
                book.author.toLowerCase().includes(lowercaseQuery)
            );
        }

        const optimizedBooks = books.map((book: any) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            cover_url: book.cover_url,
            price_mist: book.price_mist,
            owner_wallet: book.owner_wallet || 'Admin'
        })).reverse();

        res.json(optimizedBooks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
};

export const addBook = async (req: Request, res: Response) => {
    try {
        const db = readDB();
        const newBook = {
            id: Date.now().toString(),
            ...req.body,
            timestamp: new Date().toISOString()
        };
        db.books.push(newBook);
        
        // Ghi nhật ký hoạt động
        db.auditLogs = db.auditLogs || [];
        db.auditLogs.push({
            id: Date.now().toString(),
            action: 'PUBLISH',
            book_title: newBook.title,
            timestamp: new Date().toISOString()
        });

        writeDB(db);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add book' });
    }
};

export const updateBook = async (req: Request, res: Response) => {
    try {
        const db = readDB();
        const index = db.books.findIndex((b: any) => b.id === req.params.id);
        
        if (index === -1) return res.status(404).json({ error: 'Book not found' });

        db.books[index] = { ...db.books[index], ...req.body };
        
        db.auditLogs.push({
            id: Date.now().toString(),
            action: 'UPDATE',
            book_title: db.books[index].title,
            timestamp: new Date().toISOString()
        });

        writeDB(db);
        res.json(db.books[index]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book' });
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    try {
        const db = readDB();
        const book = db.books.find((b: any) => b.id === req.params.id);
        
        if (!book) return res.status(404).json({ error: 'Book not found' });

        db.books = db.books.filter((b: any) => b.id !== req.params.id);
        
        db.auditLogs.push({
            id: Date.now().toString(),
            action: 'UNPUBLISH',
            book_title: book.title,
            timestamp: new Date().toISOString()
        });

        writeDB(db);
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book' });
    }
};

export const getBookById = async (req: Request, res: Response) => {
    try {
        const db = readDB();
        const book = db.books.find((b: any) => b.id === req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch book' });
    }
};
