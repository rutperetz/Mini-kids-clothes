import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import productsRouter from './routes/products.routes.js';//חיבור נתיב ראשי לשרת
import authRouter from './routes/auth.routes.js';
import ordersRouter from './routes/orders.routes.js';



const app = express();

// לאפשר ללקוח לקרוא לשרת
app.use(cors());
// לפענח JSON שמגיע ב-POST/PUT
app.use(express.json());
// לוגים נוחים לפיתוח
app.use(morgan('dev'));

// בדיקת חיים בסיסית (לבדיקת שהשרת עובד)
app.get('/api/health', (req, res) => {
  res.json({ ok: true, msg: 'server is up' });
});

app.use('/api/products', productsRouter);//“תן לקובץ products.routes.js לטפל בכל בקשה שמתחילה ב־/api/products.”
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);



export default app;

// נתיב בדיקה: מצב החיבור למסד
app.get('/api/db-status', (req, res) => {
  // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const state = mongoose.connection.readyState;
  const labels = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({ ok: state === 1, state, label: labels[state] || 'unknown' });
});
