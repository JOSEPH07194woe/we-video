const express = require('express');
const next = require('next');

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

const PORT = 3000;

app.prepare().then(() => {
  const server = express();

  // Serve Server-Sent Events (SSE) on `/stream`
  server.get('/stream', (req, res) => {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send initial message
    res.write(`data: Connection established\n\n`);

    // Send periodic messages
    let counter = 0;
    const interval = setInterval(() => {
      res.write(`data: Message #${counter++}\n\n`);
    }, 2000);

    // Clean up on client disconnect
    req.on('close', () => {
      clearInterval(interval);
      res.end();
    });
  });

  // Serve Next.js pages
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
