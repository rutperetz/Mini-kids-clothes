import jwt from 'jsonwebtoken';

/**
 * בודק שיש טוקן תקף ב-Header:
 * Authorization: Bearer <token>
 */
export function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || '';

    // מצפה לפורמט: "Bearer asdasdasdasd..."
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'אין הרשאה (חסר טוקן)' });
    }

    // מאמתים את הטוקן ומקבלים את המידע שבתוכו
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // נשמור את המידע הזה בבקשה כדי שנוכל להשתמש בו בהמשך (req.user)
    req.user = payload; // { id, email, role, iat, exp }

    next(); // ממשיכים לראוט הבא
  } catch (err) {
    console.error('JWT error:', err.message);
    return res.status(401).json({ error: 'טוקן לא תקף או שפג תוקפו' });
  }
}

/**
 * בודק שלמשתמש יש תפקיד מסוים (למשל 'admin')
 */
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'אין משתמש מחובר' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'אין לך הרשאה לבצע פעולה זו' });
    }
    next();
  };
}
