// Import necessary modules
const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Route for the SSE stream
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send a message every 5 seconds
  setInterval(() => {
    const message = {
      time: new Date().toLocaleTimeString(),
    };

    // Send data to the client
    res.write(`data: ${JSON.stringify(message)}\n\n`);
  }, 5000); // Sends message every 5 seconds
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
