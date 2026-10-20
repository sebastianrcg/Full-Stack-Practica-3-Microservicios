// api-gateway/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { createProxyMiddleware } = require('http-proxy-middleware');
const {authMiddleware} = require('./middlewares/auth');
const { globalLimiter, strictLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');


const app = express();
const PORT = process.env.PORT || 3000;


//--- Seguridad y utilidades base--
app.use(helmet());
app.use(cors({ origin: '*' })); // en producción: restringir a dominios específicos
app.use(morgan('combined'));
app.use(express.json());
app.use(globalLimiter);


//--- Ruta de "login" simulada (genera el JWT)--
app.post('/auth/login', strictLimiter, (req, res) => {
    const { username, password } = req.body;
    // Simulación simple — en un caso real validarías contra la BD del users-service
    if (username === 'admin' && password === '1234') {
        const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        return res.json({ token });
    }
    return res.status(401).json({ error: 'Credenciales inválidas' });
});


//--- Proxy hacia los microservicios (protegidos con JWT)--
app.use(
    '/api/users',
    authMiddleware,
    createProxyMiddleware({
        target: process.env.USERS_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { '^/api/users': '/users' }
    })
);

app.use(
    '/api/products',
    authMiddleware,
    createProxyMiddleware({
        target: process.env.PRODUCTS_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { '^/api/products': '/products' }
    })
);
app.use(
    '/api/orders',
    authMiddleware,
    createProxyMiddleware({
        target: process.env.ORDERS_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { '^/api/orders': '/orders' }
    })
);

app.use(
    '/api/reviews',
    authMiddleware,
    createProxyMiddleware({
        target: process.env.REVIEWS_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { '^/api/reviews': '/reviews' }
    })
);


//---Rutadesaluddelgateway--
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api-gateway' }));
//---Manejadordeerrores(siempre al final)--

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`API Gatewaycorriendoenpuerto ${PORT}`);
});