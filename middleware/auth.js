//verifying the token
import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token,'mynameisaaryarastogiiamamernstackdeveloper', (err, user) => {
      if (err) {
        console.log('token verification failed',err.message);
        return res.status(403).json({ message: 'Forbidden' });
      }
  
      req.user = user;
      // console.log('user')
      next();
    });
};