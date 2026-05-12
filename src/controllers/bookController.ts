import { Request, Response, NextFunction } from 'express';
import { getDB, saveDB } from '../config/db.js';
import { BookItem } from '../types.js';

export const getBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const db = getDB();
        let books = db.books;

        const queryStr = req.query.q as string | undefined;
        if (queryStr) {
            const search = queryStr.toLowerCase();
            books = books.filter(b => b.title.toLowerCase().includes(search));
        }

        res.json({ items: books });
    } catch (error) {
        next(error);
    }
};

export const addBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, author, cover_url, price_mist, access_url } = req.body;
        const db = getDB();
        
        const newBook: BookItem = {
            id: `book-${Date.now()}`,
            title,
            author,
            cover_url,
            price_mist,
            access_url
        };

        db.books.push(newBook);
        await saveDB();

        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add book' });
    }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, author, cover_url, price_mist, access_url } = req.body;
        const db = getDB();
        
        const index = db.books.findIndex(b => b.id === id);
        if (index === -1) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }

        db.books[index] = {
            ...db.books[index],
            title: title ?? db.books[index].title,
            author: author ?? db.books[index].author,
            cover_url: cover_url ?? db.books[index].cover_url,
            price_mist: price_mist ?? db.books[index].price_mist,
            access_url: access_url ?? db.books[index].access_url
        };

        await saveDB();
        res.json(db.books[index]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book' });
    }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const db = getDB();
        
        const index = db.books.findIndex(b => b.id === id);
        if (index === -1) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }

        db.books.splice(index, 1);
        await saveDB();
        
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book' });
    }
};
