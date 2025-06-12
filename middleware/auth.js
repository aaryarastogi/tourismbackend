//verifying the token
import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader); // Debug log
    
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
    console.log('Extracted Token:', token); // Debug log
  
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, 'mynameisaaryarastogiiamamernstackdeveloper', (err, user) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.status(403).json({ message: 'Forbidden' });
        }
  
        req.user = user;
        next();
    });
  };