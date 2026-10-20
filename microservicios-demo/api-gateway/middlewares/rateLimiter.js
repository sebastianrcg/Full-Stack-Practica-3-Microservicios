//api-gateway/middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');


//LímitegeneralparatodalaAPI
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, //100peticiones porIP en esa ventana
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiadas peticiones, intenta más tarde.' }
});

//Límitemásestrictopararutassensibles (ej.login)
const strictLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: { error: 'Demasiados intentos, espera unos minutos.' }
});


module.exports = { globalLimiter, strictLimiter };