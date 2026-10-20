 const express = require('express');
 const app = express();
 
 
 app.use(express.json());

 const PORT = process.env.PORT || 3004;

 const reviews = [
    {id: 1, productId: 1, comment: "Excellent quality!", rating: 5},
    {id: 2, productId: 1, comment: "Great ergonomic design.", rating: 5},
    {id: 3, productId: 2, comment: "There is a small delay in response.", rating: 3},
    {id: 4, productId: 2, comment: "Good design and battery life", rating: 4}
 ];

 app.get('/reviews', (req, res) => {
    res.json(reviews);
});

app.get('/reviews/:id', (req, res) => {
    const review = reviews.find(p => p.id === parseInt(req.params.id));
    if (!review) return res.status(404).json({ error: 'Review no encontrado' });
    res.json(review);
});

app.listen(PORT, () => {
    console.log(`Products service corriendo en puerto ${PORT}`);
});