import { Request, Response } from 'express';
import { getDB, saveDB } from '../config/db.js';

export const getMessages = async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const db = getDB();
    const session = db.chat_sessions?.find((s: any) => s.id === sessionId);
    res.json(session ? session.messages : []);
};

export const sendMessage = async (req: Request, res: Response) => {
    const { sessionId, content, isAdmin, customerName } = req.body;
    const db = getDB();
    
    if (!db.chat_sessions) db.chat_sessions = [];
    
    let session = db.chat_sessions.find((s: any) => s.id === sessionId);
    const newMessage = {
        id: `msg-${Date.now()}`,
        content,
        isAdmin: !!isAdmin,
        timestamp: new Date().toISOString()
    };

    if (session) {
        session.messages.push(newMessage);
        session.timestamp = newMessage.timestamp;
    } else {
        db.chat_sessions.push({
            id: sessionId,
            customerName: customerName || 'Khách hàng',
            messages: [newMessage],
            timestamp: newMessage.timestamp
        });
    }

    await saveDB();
    res.json(newMessage);
};
