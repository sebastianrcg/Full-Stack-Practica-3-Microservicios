const express = require('express');
const app = express();
const {roleMiddleware} = require('./../api-gateway/middlewares/auth');


app.use(express.json());


const PORT = process.env.PORT || 3002; 


const products = [
    { id: 1, name: 'Teclado mecánico', price: 45.99 },
    { id: 2, name: 'Mouse inalámbrico', price: 19.99 }
];


app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
});

app.post('/products', roleMiddleware("admin"), (req, res)=> {
    const {name, price} = req.body;
    const id = products.length + 1;

    const product = {id, name, price};

    products.push(product);

    return res.json({mensaje: "Producto agregado", product});
})

app.listen(PORT, () => {
    console.log(`Products service corriendo en puerto ${PORT}`);
});