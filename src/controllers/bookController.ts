import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../../database.json');

// Helper để đọc DB
const readDB = () => {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
};

export const getBooks = async (req: Request, res: Response) => {
    try {
        const db = readDB();
        const query = req.query.q as string;

        // Tối ưu hóa: Lọc và sắp xếp sách mới nhất lên đầu
        let books = db.books || [];
        
        if (query) {
            const lowercaseQuery = query.toLowerCase();
            books = books.filter((book: any) => 
                book.title.toLowerCase().includes(lowercaseQuery) ||
                book.author.toLowerCase().includes(lowercaseQuery)
            );
        }

        // Đảm bảo dữ liệu trả về chuẩn hóa cho Tailwind CSS ở Frontend
        const optimizedBooks = books.map((book: any) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            cover_url: book.cover_url,
            price_mist: book.price_mist,
            owner_wallet: book.owner_wallet || 'Admin'
        })).reverse(); // Sách mới nhất hiện lên trước

        res.json(optimizedBooks);
    } catch (error) {
        console.error('Get books error:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
};

export const getBookById = async (req: Request, res: Response) => {
    try {
        const db = readDB();
        const book = db.books.find((b: any) => b.id === req.params.id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch book' });
    }
};
