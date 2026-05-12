import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';
import { startSuiWatcher } from './services/suiWatcher.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// 🚀 TRANG TRẠNG THÁI SERVER DÙNG TAILWIND CSS
app.get('/', (req: Request, res: Response) => {
    res.send(`
        <html>
            <head>
                <title>Web3 Library | Main Backend</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Plus Jakarta Sans', sans-serif; }
                    .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); }
                </style>
            </head>
            <body class="bg-[#0a0a0c] text-white min-h-screen flex items-center justify-center p-6">
                <div class="max-w-2xl w-full">
                    <div class="glass border border-white/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
                        <div class="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
                        
                        <div class="relative z-10">
                            <div class="flex items-center gap-4 mb-8">
                                <div class="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/40">
                                    <svg class="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <div>
                                    <h1 class="text-2xl font-extrabold tracking-tight">WEB3 LIBRARY <span class="text-emerald-400">BACKEND</span></h1>
                                    <p class="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Main Synchronization Engine</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4 mb-10">
                                <div class="bg-white/5 rounded-3xl p-6 border border-white/5">
                                    <p class="text-xs font-bold text-white/40 uppercase mb-1">Status</p>
                                    <div class="flex items-center gap-2">
                                        <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
                                        <p class="text-lg font-black uppercase">Active</p>
                                    </div>
                                </div>
                                <div class="bg-white/5 rounded-3xl p-6 border border-white/5">
                                    <p class="text-xs font-bold text-white/40 uppercase mb-1">Uptime</p>
                                    <p class="text-lg font-black uppercase">99.9%</p>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div class="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <span class="text-sm font-bold text-white/60">API Endpoint</span>
                                    <code class="text-emerald-400 text-xs font-mono font-bold">/api/books</code>
                                </div>
                                <div class="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <span class="text-sm font-bold text-white/60">Sui Watcher</span>
                                    <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full uppercase">Monitoring</span>
                                </div>
                            </div>

                            <div class="mt-12 pt-8 border-t border-white/5 text-center">
                                <p class="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">"Powering the next generation of digital knowledge."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `);
});

// Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use(errorHandler);

// Initialize DB and Start Server
const startServer = async (): Promise<void> => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running perfectly on http://localhost:${PORT}`);
            startSuiWatcher();
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
