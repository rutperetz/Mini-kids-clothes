import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import productsRouter from './routes/products.routes.js';//חיבור נתיב ראשי לשרת
import authRouter from './routes/auth.routes.js';
import ordersRouter from './routes/orders.routes.js';
import usersRouter from "./routes/users.routes.js";



const app = express();


app.use(cors({
    origin: "*"
}));


app.use(express.json());

app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, msg: 'server is up' });
});

//Connecting all routers to the system
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use("/api/users", usersRouter);



export default app;

app.get('/api/db-status', (req, res) => {
  // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const state = mongoose.connection.readyState;
  const labels = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({ ok: state === 1, state, label: labels[state] || 'unknown' });
});
