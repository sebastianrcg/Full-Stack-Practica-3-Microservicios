// api-gateway/middlewares/auth.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Disponible en los siguientes middlewares
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
}

const roleMiddleware = (role) =>{
    return (req, res, next)=> {
        try {
            if(!role) {
                return res.status(403).json({error: "Rol invalido"});
            }

            if (req.user && req.user.role === role){
                return next()
            }

            return res.status(403).json({error: "Rol invalido para esta operacion."})
        } catch (err) {
            return res.status(403).json({error: "Error validando rol"});
        }
        
}
   
}

module.exports = {
    authMiddleware,
    roleMiddleware
};