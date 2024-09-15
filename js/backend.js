const express = require('express');
const app = express();
const TOKEN = process.env.TOKEN;

app.get('/api/getToken', (req, res) => {
    res.json({ token: TOKEN });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
