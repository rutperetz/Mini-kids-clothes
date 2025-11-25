import jwt from 'jsonwebtoken';

/*Responsible for the entire authorization system*/

//Checks if the user is logged in 
export function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || '';

    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'אין הרשאה (חסר טוקן)' });
    }
    
    // Validate the token and get the information inside it
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; 

    next(); 
  } catch (err) {
    console.error('JWT error:', err.message);
    return res.status(401).json({ error: 'Token is invalid or expired' });  }
}

/* Checks that a user has a specific role admin/use */
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No user logged in' });    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'You do not have permission to perform this action' });    }
    next();
  };
}
