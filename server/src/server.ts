import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { URL } from 'url';
import dns from 'dns/promises'; 

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT) || 5000;

app.use(express.json()); 

app.use(cors({
    origin: 'http://localhost:3000', 
}));

const filePath = path.join(__dirname, 'urls.json');
let urlMappings: { [key: string]: { url: string; clicked: number } } = {};

function loadUrls() {
    if (fs.existsSync(filePath)) {
        urlMappings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
}

function saveUrls() {
    fs.writeFileSync(filePath, JSON.stringify(urlMappings, null, 2));
}

app.use((req: Request, res: Response, next: Function) => {
    loadUrls();
    next();
});

async function validateUrl(url: string): Promise<boolean> {
    try {
        const parsedUrl = new URL(url);
        const host = parsedUrl.hostname;
        await dns.lookup(host);
        return true;
    } catch (error) {
        return false;
    }
}

const generateShortUrl = (originalUrl: string): string => {
    const shortUrl = Math.random().toString(36).substring(2, 8);
    urlMappings[shortUrl] = { url: originalUrl, clicked: 0 };
    saveUrls();
    return shortUrl;
};

const getOriginalUrl = (shortUrl: string): { url: string; clicked: number } | undefined => {
    return urlMappings[shortUrl];
};

app.post('/api/urls/shorten', async (req: Request, res: Response) => {
    const { url }: { url: string } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    const isValid = await validateUrl(url);
    if (!isValid) {
        return res.status(400).json({ error: 'Invalid URL' });
    }
    const shortUrl = generateShortUrl(url);
    res.json({ shortUrl });
});

app.get('/api/urls', (req: Request, res: Response) => {
    const urls = Object.entries(urlMappings).map(([code, { url, clicked }]) => ({ code, url, clicked }));
    res.json(urls);
});

app.get('/:shortUrl', (req: Request, res: Response) => {
    const { shortUrl } = req.params;
    const originalUrl = getOriginalUrl(shortUrl);
    if (originalUrl) {
        originalUrl.clicked++;
        saveUrls();
        res.redirect(originalUrl.url);
    } else {
        res.status(404).send('URL not found');
    }
});

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running');
});

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'URL Shortener API',
            version: '1.0.0',
        },
    },
    apis: ['./server/index.ts'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const startServer = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();
