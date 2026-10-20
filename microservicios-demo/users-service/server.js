const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;
// "Base de datos" en memoria


const users = [
    { id: 1, name: 'Ana Pérez', email: 'ana@mail.com', role: "user" },
    { id: 2, name: 'Luis Soto', email: 'luis@mail.com', role:"admin" }
];

app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
});

app.post('/users', (req, res) => {
    const newUser = { id: users.length + 1, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.listen(PORT, () => {
    console.log(`Users service corriendo en puerto ${PORT}`);
});