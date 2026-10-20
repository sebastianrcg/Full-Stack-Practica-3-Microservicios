function errorHandler(err, req, res, next) {

    console.error(`[ERROR] ${req.method} ${req.originalUrl}-`, err.message);
    
    res.status(err.status || 500).json({
        error: err.message || 'Errorinternodelservidor'
    });
}

module.exports = errorHandler;