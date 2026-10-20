// orders-service/server.js
const express = require('express');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3003;
const orders = [];

app.get('/orders', (req, res) => {
    res.json(orders);
});

app.post('/orders', (req, res) => {
    const newOrder = { id: orders.length + 1, ...req.body, createdAt: new Date() };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

app.listen(PORT, () => {
    console.log(`Orders service corriendo en puerto ${PORT}`);
});