const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/script', (req, res) => {
    const chatId = req.query.chat_id;
    res.send(`Received chat_id: ${chatId}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
