import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });

const PORT = process.env.PORT || 3000;

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// WebSocket Upgrade handling
server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (url.pathname === '/playstation-ws') {
        const session = url.searchParams.get('session') || 'default';
        wss.handleUpgrade(request, socket, head, (ws) => {
            ws.session = session;
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

// WebSocket logic
wss.on('connection', (ws) => {
    console.log(`Client connected to session: ${ws.session}`);

    ws.on('message', (message) => {
        // Broadcast to all clients in the SAME session, except sender
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === 1 && client.session === ws.session) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        console.log(`Client disconnected from session: ${ws.session}`);
    });
});

// SPA fallback: Send index.html for any unknown routes
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
